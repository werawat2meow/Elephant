import { NextResponse } from 'next/server';
import axios from 'axios';

// กำหนดค่า Token และ Group/User ID
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const TO_ID = process.env.LINE_TO_ID || '';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // สร้างข้อความจากข้อมูล booking พร้อมชื่อโปรแกรมและราคา
    const message = `Booking ใหม่\nโปรแกรม: ${data.packageName}\nชื่อ: ${data.name}\nอีเมล: ${data.email}\nเบอร์โทร: ${data.phone}\nโรงแรม: ${data.hotel}\nห้อง: ${data.roomNumber}\nวันที่: ${data.date || '-'}\nเวลา: ${data.time || '-'}\nจำนวนผู้ใหญ่: ${data.adults}\nจำนวนเด็ก: ${data.children}\nจำนวนทารก: ${data.infants}\nWhatsApp: ${data.whatsapp || '-'}\nSpecial Requests: ${data.specialRequests || '-'}\nราคารวม: ฿${data.totalPrice?.toLocaleString()}`;

    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: TO_ID,
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
