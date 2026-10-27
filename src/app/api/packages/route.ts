import { NextResponse } from "next/server";
import { tours, catalogueNotice } from '../../../lib/tours';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: tours, verified: false, notice: catalogueNotice });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Error" },
      { status: 500 }
    );
  }
}
