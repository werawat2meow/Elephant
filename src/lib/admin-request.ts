import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
export async function isAdmin(request: NextRequest) {
  if (!process.env.NEXTAUTH_SECRET || !process.env.ADMIN_EMAIL) return false;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return token?.email?.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase();
}
