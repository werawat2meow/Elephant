"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type MainNavProps = { onNavigate?: () => void };
type AppRole = "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER" | undefined;

// เมนูเดิมของคุณ
const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/requests",  label: "Requests" },
  { href: "/approvals", label: "Approvals" },
  { href: "/reports",   label: "Reports" },
  { href: "/settings",  label: "Settings" },
];

// สิทธิ์ของแต่ละเมนูตามที่คุณต้องการ
// - ADMIN/MASTER_ADMIN: ทุกเมนู
// - MANAGER: Approvals เท่านั้น
// - USER: Requests เท่านั้น
const ACCESS: Record<string, "any" | "auth" | AppRole[]> = {
  "/dashboard": ["ADMIN", "MASTER_ADMIN"],
  "/requests":  ["USER", "ADMIN", "MASTER_ADMIN"],
  "/approvals": ["MANAGER", "ADMIN", "MASTER_ADMIN"],
  "/reports":   ["ADMIN", "MASTER_ADMIN"],
  "/settings":  ["ADMIN", "MASTER_ADMIN"],
};

function canClick(
  href: string,
  role: AppRole,
  authed: boolean
): boolean {
  const rule = ACCESS[href] ?? "auth";
  if (rule === "any") return true;
  if (rule === "auth") return authed;
  if (!authed) return false;
  return rule.includes(role as Exclude<AppRole, undefined>);
}

export default function MainNav({ onNavigate }: MainNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session as any)?.role as AppRole;
  const authed = !!session;

  return (
    <nav className="p-4 md:p-5" aria-label="Main">
      <ul className="space-y-2">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname?.startsWith(it.href + "/");

          const disabled = !canClick(it.href, role, authed);

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={(e) => {
                  if (disabled) { e.preventDefault(); return; }
                  onNavigate?.();
                }}
                aria-disabled={disabled}
                aria-current={active ? "page" : undefined}
                title={
                  disabled
                    ? !authed
                      ? "กรุณาเข้าสู่ระบบก่อน"
                      : "ไม่มีสิทธิ์เข้าถึงเมนูนี้"
                    : undefined
                }
                className={`block rounded-xl px-4 py-2 font-medium transition
                  ${
                    active
                      ? "bg-[rgba(8,247,254,.15)] text-[var(--text)] ring-1 ring-[rgba(8,247,254,.35)]"
                      : "hover:bg-[rgba(255,255,255,.05)] text-[#a3adc2]"
                  }
                  ${
                    disabled
                      ? "cursor-not-allowed opacity-50 ring-1 ring-slate-300/50 dark:ring-white/10 hover:bg-transparent"
                      : ""
                  }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
