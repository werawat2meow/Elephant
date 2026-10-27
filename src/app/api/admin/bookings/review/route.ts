import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/admin-request';
import { sameOrigin } from '../../../../../lib/stripe-payments';
import { openTicket } from '../../../../../lib/booking-tickets';
import { approveAndEmail } from '../../../../../lib/booking-review';
import { reviewBookingPricing } from '../../../../../lib/booking-pricing';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  if (!await isAdmin(request) || !sameOrigin(request)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 16000) return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
    const body = JSON.parse(text);
    const ticket = openTicket(body.ticket);
    if (body.action === 'preview') return NextResponse.json({ booking: ticket.booking, pricing: reviewBookingPricing(ticket), reference: `JR-${ticket.requestId}`, expires: ticket.expires }, { headers: { 'Cache-Control': 'private, no-store' } });
    if (body.action !== 'approve' || body.reviewed !== true) return NextResponse.json({ error: 'staff_review_required' }, { status: 400 });
    const result = await approveAndEmail(body.ticket, body.quote);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'review_or_email_failed', message: 'ยังยืนยันการส่งอีเมลไม่ได้ กรุณาตรวจค่าตั้งและลองใหม่ด้วยข้อมูลเดิม / Email acceptance is not confirmed. Check configuration and retry the same details.' }, { status: 503 });
  }
}
