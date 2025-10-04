"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MainNavProps = {
  onNavigate?: () => void;   // <-- เพิ่ม prop (optional)
};

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/requests",  label: "Requests" },
  { href: "/approvals", label: "Approvals" },
  { href: "/reports",   label: "Reports" },
  { href: "/settings",  label: "Settings" },
];

export default function MainNav({ onNavigate }: MainNavProps) {  // <-- รับ prop
  const pathname = usePathname();

  return (
    <nav className="p-4 md:p-5" aria-label="Main">
      <ul className="space-y-2">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname?.startsWith(it.href + "/");

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={onNavigate}                 // <-- ใช้ prop ที่นี่
                aria-current={active ? "page" : undefined}
                className={`block rounded-xl px-4 py-2 font-medium transition
                  ${
                    active
                      ? "bg-[rgba(8,247,254,.15)] text-[var(--text)] ring-1 ring-[rgba(8,247,254,.35)]"
                      : "hover:bg-[rgba(255,255,255,.05)] text-[#a3adc2]"
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
