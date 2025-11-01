import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_HOME: Record<string, string> = {
  MASTER_ADMIN: "/dashboard",
  ADMIN: "/dashboard",
  MANAGER: "/approvals",
  USER: "/requests",
};

// ตรวจสิทธิ์เข้าหน้าไหนได้บ้าง
function pathAllowed(path: string, role?: string): boolean {
  // public: login, api auth, assets
  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon")
  ) return true;

  // ต้องล็อกอินตั้งแต่ตรงนี้
  if (!role) return false;

  // admin เต็มสิทธิ์
  if (role === "ADMIN" || role === "MASTER_ADMIN") return true;

  // manager: approvals เท่านั้น (และอนุญาตหน้า APIs/ไฟล์ที่เกี่ยว)
  if (role === "MANAGER") {
    return path.startsWith("/approvals");
  }

  // user: requests เท่านั้น
  if (role === "USER") {
    return path.startsWith("/requests");
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // อ่าน token จาก next-auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role as string | undefined;

  // ถ้ากดเข้าหน้า root "/" → ส่งไปหน้าแรกตาม role (ถ้ามี token)
  if (pathname === "/") {
    if (role) {
      const dest = ROLE_HOME[role] ?? "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ถ้าเป็นหน้าอื่น: ตรวจสิทธิ์
  const allowed = pathAllowed(pathname, role);
  if (!allowed) {
    // ไม่มีสิทธิ์ → ส่งกลับหน้าแรกตาม role หรือ /login ถ้าไม่ล็อกอิน
    const dest = role ? (ROLE_HOME[role] ?? "/dashboard") : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // ตรวจทุกหน้าในกลุ่มที่เกี่ยว (เพิ่มได้ตามโครงสร้างโปรเจกต์)
  matcher: [
    "/",
    "/dashboard/:path*",
    "/requests/:path*",
    "/approvals/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
  ],
};
