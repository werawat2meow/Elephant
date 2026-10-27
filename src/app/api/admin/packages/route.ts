import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, data: [] }); // ไม่ดึงข้อมูลจาก database แล้ว
}

export async function POST(request: Request) {
  return NextResponse.json(
    { ok: false, message: "Catalogue editing is not connected. Edit data/packages.json and redeploy." },
    { status: 503 }
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
