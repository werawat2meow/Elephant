import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "packages.json");

async function readData() {
  try {
    const txt = await fs.readFile(dataFile, "utf8");
    return JSON.parse(txt || "[]");
  } catch (e) {
    return [];
  }
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Error" },
      { status: 500 }
    );
  }
}
