import { createHash, createHmac } from 'crypto';
import { openTicket } from './booking-tickets';
import { mailReady, sendBookingMail } from './booking-mail';
import { checkoutInput, paymentsReady, stripeClient, type ApprovedQuote } from './stripe-payments';

export function validateQuote(value: unknown): ApprovedQuote {
  const v = value as Record<string, unknown> | null;
  if (!v || typeof v.amountTHB !== 'number' || !Number.isFinite(v.amountTHB) || v.amountTHB <= 0 || v.amountTHB > 1000000 || Math.abs(v.amountTHB * 100 - Math.round(v.amountTHB * 100)) > 0.000001) throw new Error('invalid_final_price');
  for (const field of ['operator', 'arrangements', 'cancellationTerms']) if (typeof v[field] !== 'string' || (v[field] as string).trim().length < 5 || (v[field] as string).length > 600) throw new Error('provider_pickup_and_cancellation_terms_required');
  return { amountTHB: v.amountTHB, operator: (v.operator as string).trim(), arrangements: (v.arrangements as string).trim(), cancellationTerms: (v.cancellationTerms as string).trim() };
}
export async function approveAndEmail(token: string, value: unknown) {
  const ticket = openTicket(token);
  const quote = validateQuote(value);
  if (!paymentsReady() || !mailReady()) throw new Error('stripe_line_or_email_not_configured');
  const origin = new URL(process.env.SITE_ORIGIN || '');
  if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') && origin.protocol !== 'https:') throw new Error('live_https_required');
  const approvalHash = createHash('sha256').update(JSON.stringify({ requestId: ticket.requestId, booking: ticket.booking, quote })).digest('hex');
  const digest = createHmac('sha256', process.env.BOOKING_TICKET_SECRET || process.env.NEXTAUTH_SECRET!).update(approvalHash).digest('hex');
  const accessKey = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-8${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
  const input = checkoutInput({ ...ticket.booking, requestId: accessKey }, quote);
  if (!input.booking || !input.metadata) throw new Error('booking_date_or_details_invalid');
  input.metadata.request_reference = `JR-${ticket.requestId}`;
  const session = await stripeClient().checkout.sessions.create({
    mode: 'payment', payment_method_types: ['card'], customer_email: ticket.booking.email,
    client_reference_id: `JR-${ticket.requestId}`,
    line_items: [{ price_data: { currency: 'thb', product_data: { name: input.tour!.name.en }, unit_amount: input.amount! }, quantity: 1 }],
    metadata: input.metadata, payment_intent_data: { metadata: { integration: 'jasmine-v1', request_reference: `JR-${ticket.requestId}` } },
    success_url: `${origin.origin}/booking?status=success&session_id={CHECKOUT_SESSION_ID}#booking_key=${accessKey}`,
    cancel_url: `${origin.origin}/booking?status=cancel`,
  }, { idempotencyKey: `approved-${approvalHash}` });
  if (session.payment_status === 'paid') return { status: 'PAID', sessionId: session.id, message: 'This checkout is already paid. No new payment email was sent.' };
  if (!session.url || session.status === 'expired') throw new Error('checkout_link_expired_or_unavailable');
  const expiry = session.expires_at ? new Date(session.expires_at * 1000).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }) + ' (Phuket)' : 'See Stripe checkout';
  const text = `Hello ${ticket.booking.name},\n\nWe have checked your booking request and can offer the arrangements below. Payment is still required; this email is not proof of payment.\n\nTour: ${input.tour!.name.en}\nDate: ${ticket.booking.date}\nTime: ${ticket.booking.time} (Phuket)\nAdults: ${ticket.booking.adults} / Children: ${ticket.booking.children} / Infants: ${ticket.booking.infants || 0}\nProvider and location: ${quote.operator}\nPickup and agreed inclusions/exclusions: ${quote.arrangements}\nCancellation/refund terms: ${quote.cancellationTerms}\nFinal total: THB ${quote.amountTHB.toLocaleString('en-US')}\nReference: JR-${ticket.requestId}\n\nPay securely by card on Stripe:\n${session.url}\nLink expires: ${expiry}\n\nทีมงานตรวจสอบคำขอแล้ว รายละเอียดและราคาตามข้างต้น กรุณาตรวจสอบเงื่อนไขก่อนชำระผ่านลิงก์ Stripe นี้ อีเมลฉบับนี้ยังไม่ใช่หลักฐานการชำระเงิน หลังจ่ายสำเร็จ ระบบจะส่งอีเมลยืนยันรับชำระ หากจ่ายแล้วไม่ต้องชำระซ้ำ\n\nJasmine Tour`;
  const emailId = await sendBookingMail(ticket.booking.email, 'Your tour is available — payment link / รายละเอียดจองและลิงก์ชำระเงิน', text, `approval/${approvalHash}`);
  return { status: 'AWAITING_PAYMENT', emailId, sessionId: session.id, recipient: ticket.booking.email, checkoutUrl: session.url };
}
