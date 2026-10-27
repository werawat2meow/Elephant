import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { validateBooking } from '../../../lib/booking-validation';
import { prepareBookingMessage } from '../../../lib/booking-message';
import { issueTicket, ticketReady } from '../../../lib/booking-tickets';
import { sameOrigin } from '../../../lib/stripe-payments';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false, error: 'invalid_origin' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 16000) return NextResponse.json({ success: false, error: 'payload_too_large' }, { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 }); }
    const checked = validateBooking(body);
    if (!checked.data) return NextResponse.json({ success: false, errors: checked.errors }, { status: 400 });
    if (typeof body.requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(body.requestId)) return NextResponse.json({ success: false, error: 'invalid_request_id' }, { status: 400 });
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN, recipient = process.env.LINE_TO_ID;
    if (!token || !recipient || !process.env.SITE_ORIGIN || !ticketReady()) return NextResponse.json({ success: false, error: 'booking_not_configured', message: 'ยังไม่ได้ตั้งค่ารับคำขอและ LINE ข้อมูลในฟอร์มยังอยู่ / Booking notifications are not configured.' }, { status: 503 });
    const origin = new URL(process.env.SITE_ORIGIN);
    const ticket = issueTicket(checked.data, body.requestId);
    const reviewUrl = `${origin.origin}/admin/bookings#ticket=${ticket}`;
    const digest = createHash('sha256').update(`${recipient}:${body.requestId}:${JSON.stringify(checked.data)}`).digest('hex');
    const retryKey = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-8${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
    const reference = `JR-${body.requestId}`;
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Line-Retry-Key': retryKey },
      body: JSON.stringify({ to: recipient, messages: [
        { type: 'text', text: `${prepareBookingMessage(checked.data).message}\nRef: ${reference}\nสถานะ: รอตรวจสอบ ยังไม่เรียกเก็บเงิน / Pending staff review — no payment requested` },
        { type: 'text', text: `เจ้าหน้าที่: ตรวจสอบที่ว่าง ราคา และเงื่อนไข แล้วเปิดลิงก์นี้เพื่อล็อกอินและกดยืนยันส่งอีเมลพร้อมลิงก์ชำระให้ลูกค้า (ลิงก์ตรวจสอบมีอายุ 7 วัน)\n${reviewUrl}` },
      ] }), signal: AbortSignal.timeout(12000),
    });
    if (!response.ok && !(response.status === 409 && response.headers.get('x-line-accepted-request-id'))) throw new Error('line_send_failed');
    return NextResponse.json({ success: true, status: 'PENDING_REVIEW', reference }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'request_notification_failed', message: 'ยังยืนยันการส่งคำขอไม่ได้ ข้อมูลยังอยู่ กรุณาลองใหม่ / Could not confirm the notification. Please retry.' }, { status: 503 });
  }
}
