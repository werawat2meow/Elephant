"use client";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import LogoutButton from "./LogoutButton";

export default function AppHeader() {
  // const router = useRouter();
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/dashboard" className="text-xl md:text-2xl font-bold">
        Leave Management
      </Link>
      <div className="flex items-center gap-3">
        <LangSwitch />
        <ThemeToggle />
        {/* <button
          onClick={() => { localStorage.removeItem("demo-auth"); router.push("/login"); }}
          className="rounded-xl px-4 py-2 font-semibold bg-[var(--cyan)] text-[#001418] shadow-[0_8px_26px_rgba(8,247,254,.35)]"
        >
          Logout
        </button> */}
        <LogoutButton />
      </div>
    </header>
  );
}
