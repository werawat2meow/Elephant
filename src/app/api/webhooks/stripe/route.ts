import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripeClient, notifyPaidSession, verifiedPaid } from '../../../../lib/stripe-payments';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 });
  const stripe = stripeClient();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(Buffer.from(await request.arrayBuffer()), request.headers.get('stripe-signature') || '', process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: 'invalid_signature' }, { status: 400 }); }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return NextResponse.json({ received: true });
  try {
    const incoming = event.data.object as Stripe.Checkout.Session;
    if (incoming.metadata?.integration !== 'jasmine-v1') return NextResponse.json({ received: true });
    const session = await stripe.checkout.sessions.retrieve(incoming.id);
    if (!verifiedPaid(session)) return NextResponse.json({ received: true });
    await notifyPaidSession(stripe, session);
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: 'fulfilment_failed' }, { status: 500 }); }
}
