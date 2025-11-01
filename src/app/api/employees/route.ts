// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

  console.log("[API /employees] session =", {
    email: session?.user?.email,
    role,
  });

  if (!role) {
    console.warn("[API /employees] 401 no role/session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "MASTER_ADMIN" && role !== "ADMIN") {
    console.warn("[API /employees] 403 forbidden role =", role);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  console.log("[API /employees] body =", body);

  // VALIDATE
  if (!body.empNo || !body.firstName || !body.lastName) {
    console.warn("[API /employees] 400 missing fields empNo/firstName/lastName");
    return NextResponse.json({ error: "empNo/firstName/lastName is required" }, { status: 400 });
  }
  if (!body.email) {
    console.warn("[API /employees] 400 missing email");
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    console.warn("[API /employees] 400 invalid email format");
    return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
  }
  if (!body.idCard) {
    console.warn("[API /employees] 400 missing idCard");
    return NextResponse.json({ error: "idCard is required (ใช้เป็นรหัสเริ่มต้น)" }, { status: 400 });
  }

  try {
    // TRANSACTION
    const emp = await prisma.$transaction(async (tx) => {
      // หา/สร้าง user
      let user = await tx.user.findUnique({ where: { email: body.email } });
      console.log("[API /employees] find user by email ->", !!user);

      if (!user) {
        const passwordHash = await bcrypt.hash(String(body.idCard), 12);
        user = await tx.user.create({
          data: {
            email: body.email,
            name: `${body.firstName} ${body.lastName}`.trim(),
            role: "USER",
            passwordHash,
          },
        });
        console.log("[API /employees] created user id =", user.id);
      }

      // สร้าง employee
      const created = await tx.employee.create({
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
          userId: user.id,
        },
      });
      console.log("[API /employees] created employee id =", created.id, "userId =", created.userId);
      return created;
    });

    console.log("[API /employees] 201 OK employeeId =", emp.id);
    return NextResponse.json(emp, { status: 201 });
  } catch (e: any) {
    console.error("[API /employees] ERROR =", e);
    if (e?.code === "P2002") {
      // unique constraint
      return NextResponse.json({ error: "ข้อมูลซ้ำ (empNo หรือ email หรือ idCard)" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
