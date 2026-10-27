import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'payment_invoice_unavailable', message: 'An arbitrary booking payload cannot issue a payment invoice. Verify the Stripe payment first.' }, { status: 503 });
}
