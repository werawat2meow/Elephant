import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');
    const dept = searchParams.get('dept');
    const division = searchParams.get('division');
    const unit = searchParams.get('unit');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const showConfirmed = searchParams.get('showConfirmed') === 'true';

    // สร้าง where condition
    const where: any = {
      status: "APPROVED", // เฉพาะที่ manager อนุมัติแล้ว
      hrConfirmed: showConfirmed, // true = ยืนยันแล้ว, false = รอยืนยัน
    };

    // กรองตามวันที่
    if (dateFrom || dateTo) {
      where.AND = [];
      if (dateFrom) {
        where.AND.push({ startDate: { gte: new Date(dateFrom) } });
      }
      if (dateTo) {
        where.AND.push({ endDate: { lte: new Date(dateTo) } });
      }
    }

    // กรองตาม org structure
    if (org || dept || division || unit) {
      where.user = {
        employee: {
          ...(org && { org }),
          ...(dept && { department: dept }),
          ...(division && { division }),
          ...(unit && { unit }),
        }
      };
    }

    const leaves = await prisma.leave.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            employee: {
              select: {
                empNo: true,
                firstName: true,
                lastName: true,
                org: true,
                department: true,
                division: true,
                unit: true,
                levelP: true,
              }
            }
          }
        },
        approver: {
          select: {
            prefix: true,
            firstNameTh: true,
            lastNameTh: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format ข้อมูลตาม frontend
    const formattedLeaves = leaves.map(leave => ({
      id: leave.id.toString(),
      empNo: leave.user.employee?.empNo || '',
      name: leave.user.name || `${leave.user.employee?.firstName} ${leave.user.employee?.lastName}`,
      org: leave.user.employee?.org || '',
      dept: leave.user.employee?.department || '',
      division: leave.user.employee?.division || '',
      unit: leave.user.employee?.unit || '',
      leaveType: leave.kind,
      reason: leave.reason || '',
      from: leave.startDate.toISOString().split('T')[0], // YYYY-MM-DD
      to: leave.endDate.toISOString().split('T')[0],
      levelP: leave.user.employee?.levelP || '',
      status: leave.status.toLowerCase(),
      hrConfirmed: leave.hrConfirmed,
      approverName: leave.approver 
        ? `${leave.approver.prefix || ''}${leave.approver.firstNameTh} ${leave.approver.lastNameTh}`
        : 'ยังไม่ระบุผู้อนุมัติ',
    }));

    return NextResponse.json({ 
      ok: true, 
      data: formattedLeaves 
    });
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}