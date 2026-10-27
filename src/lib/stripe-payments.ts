import Stripe from 'stripe';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { validateBooking } from './booking-validation';
import { prepareBookingMessage } from './booking-message';
import { tours } from './tours';
import { sendBookingMail } from './booking-mail';

export type ApprovedQuote = { amountTHB: number; operator: string; arrangements: string; cancellationTerms: string };

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('stripe_not_configured');
  return new Stripe(key, { apiVersion: '2022-11-15', maxNetworkRetries: 2, timeout: 15000 });
}
export function paymentsReady() {
  return process.env.PAYMENTS_ENABLED === 'true' && !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET && !!process.env.LINE_CHANNEL_ACCESS_TOKEN && !!process.env.LINE_TO_ID;
}
export function sameOrigin(request: Request) {
  const target = new URL(request.url);
  const host = request.headers.get('host');
  if (host) target.host = host;
  const protocol = request.headers.get('x-forwarded-proto');
  if (protocol === 'https' || protocol === 'http') target.protocol = `${protocol}:`;
  return request.headers.get('origin') === target.origin;
}
export function checkoutInput(value: unknown, approval?: ApprovedQuote) {
  const checked = validateBooking(value);
  if (!checked.data) return { errors: checked.errors };
  const requestId = (value as Record<string, unknown>).requestId;
  if (typeof requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(requestId)) return { errors: ['Invalid checkout request. Reload and retry.'] };
  const booking = checked.data;
  const tour = tours.find(t => t.id === booking.packageId)!;
  const amount = approval ? Math.round(approval.amountTHB * 100) : (tour.price.adult * booking.adults + tour.price.child * booking.children) * 100;
  const prepared = prepareBookingMessage(booking).message;
  const notification = ['💳 Payment received — Jasmine Tour', 'ชำระเงินแล้ว / Payment verified by Stripe', ...prepared.split('\n').slice(2).filter(line => !line.startsWith('Indicative total:')), `Paid total: THB ${(amount / 100).toLocaleString('en-US')}`, ...(approval ? [`Provider: ${approval.operator}`, `Agreed arrangements: ${approval.arrangements}`, `Cancellation terms: ${approval.cancellationTerms}`] : [])].join('\n');
  const characters = Array.from(notification);
  const metadata: Record<string, string> = { integration: 'jasmine-v1', expected_amount: String(amount), access_hash: createHash('sha256').update(requestId).digest('hex') };
  let chunks = 0;
  for (let i = 0; i < characters.length; i += 400) metadata[`notification_${chunks++}`] = characters.slice(i, i + 400).join('');
  metadata.notification_chunks = String(chunks);
  const snapshot = Array.from(JSON.stringify(booking));
  let bookingChunks = 0;
  for (let i = 0; i < snapshot.length; i += 400) metadata[`booking_${bookingChunks++}`] = snapshot.slice(i, i + 400).join('');
  metadata.booking_chunks = String(bookingChunks);
  if (approval) metadata.staff_approved = 'true';
  return { errors: [], booking, tour, amount, requestId, metadata, idempotencyKey: `jasmine-${requestId}-${createHash('sha256').update(JSON.stringify({ booking, approval, amount })).digest('hex')}` };
}
export function sessionBooking(session: Stripe.Checkout.Session) {
  const count = Number(session.metadata?.booking_chunks);
  if (!Number.isInteger(count) || count < 1 || count > 20) return null;
  try { return JSON.parse(Array.from({ length: count }, (_, i) => session.metadata?.[`booking_${i}`] || '').join('')); }
  catch { return null; }
}
export function ownsSession(session: Stripe.Checkout.Session, key: string) {
  const expected = session.metadata?.access_hash || '';
  const supplied = createHash('sha256').update(key).digest('hex');
  return expected.length === supplied.length && timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}
export function verifiedPaid(session: Stripe.Checkout.Session) {
  return session.metadata?.integration === 'jasmine-v1' && session.mode === 'payment' && session.payment_status === 'paid' && session.status === 'complete' && session.currency === 'thb' && !!session.payment_intent && Number.isSafeInteger(session.amount_total) && Number(session.amount_total) > 0 && String(session.amount_total) === session.metadata.expected_amount;
}
export async function notifyPaidSession(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (!verifiedPaid(session)) throw new Error('unverified_payment');
  const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent!.id;
  const payment = await stripe.paymentIntents.retrieve(paymentId);
  if (payment.status !== 'succeeded' || payment.currency !== 'thb' || payment.amount_received !== session.amount_total) throw new Error('unverified_payment_intent');
  const alreadyNotified = payment.metadata.jasmine_line_notified === session.id;
  const count = Number(session.metadata?.notification_chunks);
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error('invalid_booking_metadata');
  const parts = Array.from({ length: count }, (_, i) => session.metadata?.[`notification_${i}`]);
  if (parts.some(part => typeof part !== 'string')) throw new Error('missing_booking_metadata');
  if (!alreadyNotified) {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN, recipient = process.env.LINE_TO_ID;
    if (!token || !recipient) throw new Error('line_not_configured');
    const digest = createHmac('sha256', token).update(`paid:${recipient}:${paymentId}`).digest('hex');
    const retryKey = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-8${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Line-Retry-Key': retryKey },
      body: JSON.stringify({ to: recipient, messages: [{ type: 'text', text: `${parts.join('')}\nStripe payment: ${paymentId}\nRef: ${session.id}` }] }), signal: AbortSignal.timeout(12000),
    });
    if (!response.ok && !(response.status === 409 && response.headers.get('x-line-accepted-request-id'))) throw new Error('line_notification_failed');
    // Persist the notification marker at Stripe, not in a local database/file.
    await stripe.paymentIntents.update(paymentId, { metadata: { jasmine_line_notified: session.id } });
  }
  if (session.metadata?.staff_approved === 'true' && payment.metadata.jasmine_paid_email !== session.id) {
    const booking = sessionBooking(session);
    if (!booking?.email) throw new Error('missing_customer_email');
    await sendBookingMail(booking.email, 'Payment received — Jasmine Tour / ยืนยันรับชำระเงิน', `Hello ${booking.name},\n\nStripe has verified your payment of THB ${(session.amount_total! / 100).toLocaleString('en-US')}.\nTour: ${tours.find(t => t.id === booking.packageId)?.name.en || booking.packageId}\nDate: ${booking.date}\nTime: ${booking.time} (Phuket)\nReference: ${session.id}\n\nYour booking has been paid. The agreed operator, pickup and cancellation terms from your payment email remain applicable. Contact the team with this reference for any questions.\n\nยืนยันรับชำระเงินแล้ว โปรดเก็บเลขอ้างอิงนี้ไว้ และใช้รายละเอียดผู้ให้บริการ รถรับส่ง และเงื่อนไขตามอีเมลก่อนชำระเงิน`, `paid/${paymentId}`);
    await stripe.paymentIntents.update(paymentId, { metadata: { jasmine_paid_email: session.id } });
  }
}
