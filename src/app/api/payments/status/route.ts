import { NextResponse } from 'next/server';
import { stripeClient, ownsSession, verifiedPaid, notifyPaidSession, sessionBooking } from '../../../../lib/stripe-payments';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('session_id') || '';
  const key = request.headers.get('x-booking-key') || '';
  if (!/^cs_(test_|live_)?[a-zA-Z0-9_]+$/.test(id) || !/^[a-f\d-]{36}$/i.test(key)) return NextResponse.json({ error: 'invalid_session' }, { status: 400 });
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(id);
    if (!ownsSession(session, key)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (!verifiedPaid(session)) return NextResponse.json({ paid: false }, { headers: { 'Cache-Control': 'private, no-store' } });
    let notificationPending = false;
    try { await notifyPaidSession(stripe, session); } catch { notificationPending = true; }
    return NextResponse.json({ paid: true, reference: session.id, amountTHB: session.amount_total! / 100, notificationPending, booking: sessionBooking(session) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return NextResponse.json({ error: 'verification_unavailable' }, { status: 503 }); }
}
