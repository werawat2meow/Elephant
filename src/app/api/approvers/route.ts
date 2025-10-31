import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Role = "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER";
function canWrite(role?: Role) {
    return role === "MASTER_ADMIN" || role === "ADMIN";
}

// GET /api/approvers (list ทั้งหมด หรือรองรับ query ภายหลังก็ได้)
export async function GET() {
    const items = await prisma.approver.findMany({
        orderBy: { id: "desc" },
    });
    return NextResponse.json(items);
}

// POST /api/approvers  (สร้างใหม่)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as Role | undefined;
  if (!canWrite(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    prefix?: string;
    firstNameTh?: string;
    lastNameTh?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    empNo?: string;
    citizenId?: string;
    org?: string;
    department?: string;
    division?: string;
    unit?: string;
    level?: string;
    lineId?: string;
  };

  if (!body?.firstNameTh || !body?.lastNameTh || !body?.empNo) {
    return NextResponse.json({ error: "firstNameTh/lastNameTh/empNo is required" }, { status: 400 });
  }

  try {
    const saved = await prisma.approver.create({
      data: {
        prefix: body.prefix?.trim() || null,
        firstNameTh: body.firstNameTh.trim(),
        lastNameTh: body.lastNameTh.trim(),
        firstNameEn: body.firstNameEn?.trim() || null,
        lastNameEn: body.lastNameEn?.trim() || null,
        empNo: body.empNo.trim(),
        citizenId: body.citizenId?.trim() || null,
        org: body.org?.trim() || null,
        department: body.department?.trim() || null,
        division: body.division?.trim() || null,
        unit: body.unit?.trim() || null,
        level: body.level?.trim() || null,
        lineId: body.lineId?.trim() || null,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      // ชน unique (empNo หรือ citizenId)
      return NextResponse.json({ error: "duplicate empNo/citizenId" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/approvers?id=123 (อัปเดตทีละรายการ)
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const role = (session as any)?.role as Role | undefined;
    if (!canWrite(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const id = idParam ? Number(idParam) : undefined;
    if (!Number.isFinite(id) || id! <=0) {
        return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }

     const body = await req.json() as Partial<{
        prefix: string;
        firstNameTh: string;
        lastNameTh: string;
        firstNameEn: string;
        lastNameEn: string;
        empNo: string;
        citizenId: string;
        org: string;
        department: string;
        division: string;
        unit: string;
        level: string;
        lineId: string;
    }>;

    try {
        const updated = await prisma.approver.update({
            where: { id: id! },
            data: Object.fromEntries(
                Object.entries(body).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
            ),
        });
        return NextResponse.json(updated);
    } catch (e: any) {
        if (e?.code === "P2025") {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }
        if (e?.code === "P2002") {
            return NextResponse.json({ error: "duplicate empNo/citizenId" }, { status: 409 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}