"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import LogoutButton from "./LogoutButton";
import { useEffect, useRef, useState } from "react";

/* ===== helpers ===== */
function getInitials(fullname?: string): string {
  if (!fullname) return "?";
  return fullname
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join("") || "?";
}

function Avatar({ name, image }: { name?: string; image?: string }) {
  const initials = getInitials(name);
  return image ? (
    <img
      src={image}
      alt="avatar"
      className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div
      aria-hidden
      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center
                 bg-slate-200 text-slate-700 text-xs font-semibold
                 dark:bg-slate-700 dark:text-slate-100"
    >
      {initials}
    </div>
  );
}

/* ===== compact dropdown สำหรับจอเล็ก ===== */
function CompactMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative z-[90]" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="rounded-xl px-2 py-1 ring-1 ring-slate-300/60 dark:ring-white/10 hover:bg-white/5"
        title="เมนู"
      >
        ⋮
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl
                     dark:border-white/10 dark:bg-[#0b1220]"
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ===== Header ===== */
export default function AppHeader() {
  const { data: session, status } = useSession();
  const userLabel = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <header className="relative z-[80] flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
      {/* ซ้าย: โลโก้/ชื่อระบบ */}
      <Link href="/dashboard" className="text-lg font-bold sm:text-xl md:text-2xl">
        Leave Management
      </Link>

      {/* ขวา: responsive */}
      {status === "authenticated" ? (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* <sm: avatar + dropdown เพื่อประหยัดพื้นที่ */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/me"
              className="rounded-xl px-1.5 py-1 hover:bg-white/5 dark:hover:bg-white/5"
              title="โปรไฟล์ของฉัน"
              aria-label="โปรไฟล์ของฉัน"
            >
              <Avatar name={userLabel} image={session?.user?.image ?? ""} />
            </Link>

            <CompactMenu>
              <div className="px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                {userLabel}
              </div>
              <Link
                href="/me"
                className="block rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                โปรไฟล์ของฉัน
              </Link>

              <div className="my-1 h-px bg-slate-200 dark:bg-white/10" />

              {/* ภาษา + ธีม (ไม่มีคำว่า Theme) */}
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <LangSwitch />
                <ThemeToggle />
              </div>

              <div className="my-1 h-px bg-slate-200 dark:bg-white/10" />

              <div className="px-2">
                <LogoutButton />
              </div>
            </CompactMenu>
          </div>

          {/* >= sm: โชว์เต็มรูปแบบ */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/me"
              className="group flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5 dark:hover:bg-white/5"
              title="โปรไฟล์ของฉัน"
              aria-label="โปรไฟล์ของฉัน"
            >
              <Avatar name={userLabel} image={session?.user?.image ?? ""} />
              <span className="text-sm">{userLabel}</span>
            </Link>

            <LangSwitch />
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      ) : (
        // ยังไม่ล็อกอิน
        <div className="flex items-center gap-2 sm:gap-3">
          {/* จอเล็ก: แค่ dropdown รวมปุ่ม */}
          <div className="sm:hidden">
            <CompactMenu>
              <div className="px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                Guest
              </div>
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <LangSwitch />
                <ThemeToggle />
              </div>
              <div className="my-1 h-px bg-slate-200 dark:bg-white/10" />
              <Link
                href="/login"
                className="block rounded-lg px-3 py-2 text-center ring-1 ring-slate-300/70 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Login
              </Link>
            </CompactMenu>
          </div>

          {/* จอใหญ่: ปุ่มปกติ */}
          <div className="hidden sm:flex items-center gap-3">
            <LangSwitch />
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 border border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
