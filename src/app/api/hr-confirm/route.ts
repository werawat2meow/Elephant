import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { leaveIds, action } = await req.json();
    
    if (!Array.isArray(leaveIds) || leaveIds.length === 0) {
      return NextResponse.json({ error: "invalid leaveIds" }, { status: 400 });
    }

    if (!['confirm', 'unconfirm'].includes(action)) {
      return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }

    const updateData = action === 'confirm' 
      ? {
          hrConfirmed: true,
          hrConfirmedAt: new Date(),
          hrConfirmedBy: session.user.email,
        }
      : {
          hrConfirmed: false,
          hrConfirmedAt: null,
          hrConfirmedBy: null,
        };

    const updatedLeaves = await prisma.leave.updateMany({
      where: {
        id: { in: leaveIds.map(id => parseInt(id)) },
        status: "APPROVED", // เฉพาะที่อนุมัติแล้ว
      },
      data: updateData,
    });

    return NextResponse.json({ 
      ok: true, 
      updated: updatedLeaves.count 
    });
  } catch (error) {
    console.error("PATCH /api/hr-confirm error:", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}