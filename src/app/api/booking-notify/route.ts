import axios from "axios";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

// กำหนดค่า Token และ Group/User ID
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const TO_ID = process.env.LINE_TO_ID || "";
const PROCESSED_FILE = path.join(
  process.cwd(),
  "booking-notify-processed.json"
);

async function readProcessed(): Promise<Record<string, boolean>> {
  try {
    const raw = await fs.readFile(PROCESSED_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeProcessed(obj: Record<string, boolean>) {
  await fs.writeFile(PROCESSED_FILE, JSON.stringify(obj, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // idempotency key: prefer explicit paymentId or paymentReference, else compute from payload
    const id =
      data.paymentId ||
      data.paymentReference ||
      (typeof data === "object"
        ? JSON.stringify(data).slice(0, 200)
        : String(Date.now()));

    const processed = await readProcessed();
    if (processed[id]) {
      return NextResponse.json({ success: true, note: "already_processed" });
    }

    const transferText =
      data.transferOption === "free"
        ? "รับส่งฟรี"
        : data.transferOption === "no_transfer"
        ? "ไม่รับส่ง"
        : "-";

    // สร้างข้อความจากข้อมูล booking พร้อมชื่อโปรแกรมและราคา
    const message = `✅ New Booking (payment confirmed)\nโปรแกรม: ${
      data.packageName
    }\nชื่อ: ${data.name}\nอีเมล: ${data.email}\nเบอร์โทร: ${
      data.phone
    }\nTransfer: ${transferText}\nโรงแรม: ${data.hotel}\nห้อง: ${
      data.roomNumber
    }\nวันที่: ${data.date || "-"}\nเวลา: ${data.time || "-"}\nจำนวนผู้ใหญ่: ${
      data.adults
    }\nจำนวนเด็ก: ${data.children}\nจำนวนทารก: ${data.infants}\nWhatsApp: ${
      data.whatsapp || "-"
    }\nSpecial Requests: ${data.specialRequests || "-"}\nราคารวม: ฿${Number(
      data.totalPrice || 0
    ).toLocaleString()}\nRef: ${id}`;

    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: TO_ID,
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    processed[id] = true;
    await writeProcessed(processed);

    return NextResponse.json({ success: true });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
