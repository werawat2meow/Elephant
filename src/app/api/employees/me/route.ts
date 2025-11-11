// src/app/api/employees/me/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Entitlement = { vacation: number; business: number; sick: number };

function startOfYearUTC(y: number) { return new Date(Date.UTC(y, 0, 1, 0, 0, 0)); }
function startOfNextYearUTC(y: number) { return new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0)); }
function dayDiffInclusive(a: Date, b: Date) {
  const A = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
  const B = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()));
  const ONE = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((+B - +A) / ONE) + 1);
}

const typeMap: Record<string, keyof Entitlement | undefined> = {
  "Annual Leave": "vacation",
  "Business Leave": "business",
  "Personal Leave": "business",
  "Sick Leave": "sick",
};

export async function GET() {
  const session = await getServerSession(authOptions);

  // --- สำคัญมาก: เพิ่ม console.log เพื่อดีบั๊ก Session User ---
  console.log("--- API /api/employees/me ---");
  console.log("Session user object:", session?.user); // ดูว่ามี id, email, อะไรบ้าง

  if (!session?.user) {
    console.log("Error: Unauthorized - No session user found.");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let employee = null as any;

  // 1. ลองค้นหา Employee ด้วย email จาก session ก่อน (เพราะคุณบอกว่า login ด้วย email)
  if (session.user.email) {
    employee = await prisma.employee.findFirst({ where: { email: session.user.email! } });
    console.log(`Attempted to find employee by email: "${session.user.email}". Found: ${employee ? true : false}`);
  }

  // 2. ถ้ายังไม่พบ และ session.user มี 'id' (ซึ่งควรจะเป็น userId ใน Employee table) ให้ลองค้นด้วย userId
  //    ตรวจสอบโครงสร้าง session.user ของคุณให้แน่ใจว่า field 'id' มีอยู่จริงและมีค่าเป็นตัวเลข
  //    ในภาพตาราง Employee ของคุณ, userId เป็น Integer (PK)
  if (!employee && (session.user as any)?.id) {
    const userIdFromSession = Number((session.user as any).id); // แปลงเป็น Number
    if (!isNaN(userIdFromSession)) { // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
        employee = await prisma.employee.findFirst({ where: { userId: userIdFromSession } });
        console.log(`Attempted to find employee by userId: ${userIdFromSession}. Found: ${employee ? true : false}`);
    } else {
        console.log(`Warning: session.user.id is not a valid number: ${(session.user as any).id}`);
    }
  }

  // ถ้ายังหาไม่เจอหลังจากพยายามทั้ง email และ userId
  if (!employee) {
    console.log("Error: Employee not found in DB for the logged-in user.");
    return NextResponse.json({ error: "employee not found" }, { status: 404 });
  }

  // --- ถ้าหา employee พบแล้ว โค้ดส่วนที่เหลือจะทำงานต่อตามปกติ ---
  console.log("Employee found successfully. Processing entitlements.");

  // 2) สิทธิ์: ถ้ามี LeaveRight ของ levelP ใช้อันนั้น ไม่งั้นใช้ fields ใน Employee เอง
  let entitled: Entitlement = {
    vacation: employee.vacationDays ?? 0,
    business: employee.businessDays ?? 0,
    sick: employee.sickDays ?? 0,
  };

  if (employee.levelP) {
    const lr = await prisma.leaveRight.findUnique({ where: { level: employee.levelP } });
    if (lr) {
      entitled = { vacation: lr.vacation, business: lr.business, sick: lr.sick };
    }
  }

  // 3) คำนวนใบลาที่ใช้ไปใน "ปีนี้" (เฉพาะอนุมัติแล้ว)
  const year = new Date().getUTCFullYear();
  const from = startOfYearUTC(year);
  const to = startOfNextYearUTC(year);

  const approved = await prisma.leave.findMany({
    where: {
      user: { email: employee.email ?? undefined }, // ตรวจสอบว่า `user` relation มี email หรือไม่
      status: "APPROVED",
      startDate: { gte: from, lt: to },
    },
    select: { type: true, startDate: true, endDate: true },
  });

  const used: Entitlement = { vacation: 0, business: 0, sick: 0 };
  for (const l of approved) {
    const bucket = typeMap[l.type];
    if (!bucket) continue;
    const n = dayDiffInclusive(new Date(l.startDate), new Date(l.endDate));
    used[bucket] += n;
  }

  const remaining: Entitlement = {
    vacation: Math.max(0, entitled.vacation - used.vacation),
    business: Math.max(0, entitled.business - used.business),
    sick: Math.max(0, entitled.sick - used.sick),
  };

  // 4) ส่งข้อมูล employee + สิทธิ์
  return NextResponse.json({
    employee: {
      empNo: employee.empNo,
      email: employee.email ?? "",
      prefix: employee.prefix ?? "",
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.org ?? employee.division ?? employee.department ?? "",
      section: employee.unit ?? "",
      department: employee.department ?? "",
      levelP: employee.levelP ?? "",
      idCard: employee.idCard ?? "",
      photoUrl: employee.photoUrl ?? null,
    },
    rights: { entitled, used, remaining, levelFrom: employee.levelP ?? null },
  });
}