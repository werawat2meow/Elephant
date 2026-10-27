import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'staff_approval_required', message: 'Submit your booking request first. Staff will review it and email a payment link after confirmation.' }, { status: 403 });
}
