import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, data: [] }); // ไม่ดึงข้อมูลจาก database แล้ว
}

export async function POST(request: Request) {
  // ตัวอย่าง: รับข้อมูลแล้วส่งต่อไป LINE หรือแค่ log
  const body = await request.json();
  console.log("Booking received:", body);
  // TODO: ส่งข้อมูลไป LINE Notify ที่นี่
  return NextResponse.json(
    { ok: true, message: "Booking sent to LINE" },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  return NextResponse.json(
    { ok: false, message: "Not supported" },
    { status: 405 }
  );
}

export async function DELETE(request: Request) {
  return NextResponse.json(
    { ok: false, message: "Not supported" },
    { status: 405 }
  );
}
