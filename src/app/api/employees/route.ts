// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Role = "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as Role | undefined;
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (role !== "MASTER_ADMIN" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // กันค่า minimum ที่จำเป็น
  if (!body.empNo || !body.firstName || !body.lastName) {
    return NextResponse.json({ error: "empNo/firstName/lastName is required" }, { status: 400 });
  }
  
  if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const emp = await prisma.employee.create({
      data: {
        empNo: body.empNo,
        email: body.email ?? null,
        prefix: body.prefix ?? null,
        firstName: body.firstName,
        lastName: body.lastName,
        idCard: body.idCard ?? null,
        org: body.org ?? null,
        department: body.department ?? null,
        division: body.division ?? null,
        unit: body.unit ?? null,
        levelP: body.levelP ?? null,
        lineId: body.lineId ?? null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        weeklyHoliday: body.weeklyHoliday ?? null,
        vacationDays: Number(body.vacationDays ?? 0),
        businessDays: Number(body.businessDays ?? 0),
        sickDays: Number(body.sickDays ?? 0),
        ordainDays: Number(body.ordainDays ?? 0),
        maternityDays: Number(body.maternityDays ?? 0),
        unpaidDays: Number(body.unpaidDays ?? 0),
        birthdayDays: Number(body.birthdayDays ?? 0),
        annualHolidays: Number(body.annualHolidays ?? 0),
        photoUrl: body.photoUrl ?? null,
        userId: body.userId ?? null,
      },
    });
    return NextResponse.json(emp, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      // unique constraint (เช่น empNo หรือ idCard ซ้ำ)
      return NextResponse.json({ error: "ข้อมูลซ้ำ (empNo หรือ email หรือ idCard)" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
