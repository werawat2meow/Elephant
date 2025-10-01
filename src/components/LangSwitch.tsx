"use client";
import { useEffect, useRef, useState } from "react";

type Lang = "th" | "en";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "th", label: "ไทย",    flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
  const host = location.hostname.startsWith("www.") ? location.hostname.slice(4) : location.hostname;
  document.cookie = `${name}=${value}; path=/; domain=.${host}`;
}

function applyLang(lang: Lang) {
  const sel = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (sel) {
    sel.value = lang;
    sel.dispatchEvent(new Event("change"));
  } else {
    setCookie("googtrans", `/auto/${lang}`);
    setCookie("googtrans", `/th/${lang}`);
    location.reload();
  }
  localStorage.setItem("app-lang", lang);
  window.dispatchEvent(new CustomEvent("app:lang", { detail: lang }));
}

export default function LangSwitch({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState<Lang>("th"); // ← คงที่เสมอระหว่าง SSR
  const ref = useRef<HTMLDivElement>(null);

  // อ่าน localStorage หลัง mount เท่านั้น (กัน hydration mismatch)
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("app-lang") as Lang | null;
    if (stored === "th" || stored === "en") setCurrent(stored);
  }, []);

  // ปิดเมนูเมื่อคลิกนอกกรอบ
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // ฟัง event สลับภาษาจากจุดอื่น ๆ
  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent<Lang>).detail;
      if (detail === "th" || detail === "en") setCurrent(detail);
    };
    window.addEventListener("app:lang", on as EventListener);
    return () => window.removeEventListener("app:lang", on as EventListener);
  }, []);

  const active = LANGS.find(l => l.code === current)!;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* ปุ่มหลัก */}
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-xl px-3 py-2 bg-[var(--input)] text-[var(--text)] flex items-center gap-2 hover:brightness-110"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* suppressHydrationWarning กันข้อความไม่ตรงชั่วคราวตอน mount */}
        <span className="text-base leading-none" suppressHydrationWarning>
          {mounted ? active.flag : "🌐"}
        </span>
        <span className="text-sm" suppressHydrationWarning>
          {mounted ? active.label : ""}
        </span>
        <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-70">
          <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-xl border border-[var(--border)] bg-[var(--panel)] z-50"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={current === l.code}
                onClick={() => { setCurrent(l.code); setOpen(false); applyLang(l.code); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5 ${
                  current === l.code ? "bg-white/5" : ""
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
