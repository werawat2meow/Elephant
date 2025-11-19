import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { employee: true }
  });
  if (!user) {
    return NextResponse.json({ error: "no user" }, { status: 400 });
  }

  // หา approver ที่ตรงกับ user นี้
  const approver = await prisma.approver.findFirst({
    where: {
      OR: [
        { email: session.user.email },
        { empNo: user.employee?.empNo }
      ]
    }
  });

  const leaveId = parseInt(params.id);
  if (isNaN(leaveId)) {
    return NextResponse.json({ error: "invalid leave id" }, { status: 400 });
  }

  const { status, approverReason, approverSignature } = await req.json();
  
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  try {
    const updatedLeave = await prisma.leave.update({
      where: { id: leaveId },
      data: {
        status,
        approverReason,
        approverSignature,
        approvedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
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
        }
      }
    });

    return NextResponse.json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave:', error);
    return NextResponse.json({ error: "failed to update leave" }, { status: 500 });
  }
}