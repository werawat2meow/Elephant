// src/app/api/holidays/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Role = "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

function canWrite(role?: Role) {
  return role === "MASTER_ADMIN" || role === "ADMIN";
}

// GET /api/holidays
export async function GET() {
  const items = await prisma.holiday.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(items);
}

// POST /api/holidays
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as Role | undefined;
  if (!canWrite(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as { title?: string; date?: string; note?: string | null };
  if (!body.title || !body.date) {
    return NextResponse.json({ error: "title/date is required" }, { status: 400 });
  }

  try {
    const saved = await prisma.holiday.create({
      data: {
        title: body.title,
        date: new Date(body.date), // รับเป็น "YYYY-MM-DD"
        note: body.note ?? null,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "duplicate (date,title)" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/holidays  (bulk upsert: ใช้ตอนกดบันทึกทั้งตาราง)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as Role | undefined;
  if (!canWrite(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await req.json() as Array<{ id?: number; title?: string; date?: string; note?: string | null }>;
  if (!Array.isArray(rows)) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // กลยุทธ์: ลบทั้งหมดทิ้งแล้วสร้างใหม่ตาม payload (เรียบง่าย/นิ่ง)
      await tx.holiday.deleteMany({});
      const created = await Promise.all(
        rows
          .filter(r => (r.title?.trim() && r.date?.trim()))
          .map(r => tx.holiday.create({
            data: {
              title: r.title!.trim(),
              date: new Date(r.date!),
              note: (r.note ?? "").trim() || null,
            }
          }))
      );
      return created;
    });
    return NextResponse.json({ count: result.length }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/holidays?id=123
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as Role | undefined;
  if (!canWrite(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.holiday.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
