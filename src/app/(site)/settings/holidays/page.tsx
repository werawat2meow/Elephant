"use client";
import { useEffect, useState } from "react";

/* ---------- Types & helpers ---------- */
type HolidayRow = {
  id: string;
  title: string; // ชื่อวันหยุด
  date: string;  // YYYY-MM-DD (input[type=date])
  note: string;  // หมายเหตุ (ถ้ามี)
};
const makeRow = (): HolidayRow => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
  title: "",
  date: "",
  note: "",
});

/* ---------- Page ---------- */
export default function AnnualHolidaysSection() {
  const LS_KEY = "annual-holidays:v1";

  const [rows, setRows] = useState<HolidayRow[]>([makeRow()]);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] =
    useState<{ type: "success" | "error"; msg: string } | null>(null);

  // โหลดจาก localStorage ครั้งแรก
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HolidayRow[];
        if (Array.isArray(parsed) && parsed.length > 0) setRows(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  /* ถ้าอยาก autosave ทุกครั้งที่แก้ไข ให้เปิดบรรทัดล่าง
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  }, [rows, hydrated]);
  */

  const updateRow = (id: string, patch: Partial<HolidayRow>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows(prev => [...prev, makeRow()]);
  const removeRow = (id: string) =>
    setRows(prev => prev.filter(r => r.id !== id));

  const handlePublish = () => {
    setSaving(true);
    try {
      // ตัดแถวที่ว่างเปล่าออกก่อนเซฟ (ถ้าไม่ต้องการลบก็เอาออก)
      const cleaned = rows.filter(r => r.title.trim() || r.date.trim() || r.note.trim());
      localStorage.setItem(LS_KEY, JSON.stringify(cleaned));
      setRows(cleaned);
      setToast({ type: "success", msg: `บันทึกแล้ว ${cleaned.length} รายการ` });
    } catch {
      setToast({ type: "error", msg: "บันทึกล้มเหลว กรุณาลองใหม่" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <section role="tabpanel" aria-label="ประกาศวันหยุดประจำปี" className="neon-card rounded-2xl p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="neon-title text-lg font-semibold">ประกาศวันหยุดประจำปี</h2>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost rounded-xl px-4 py-2" onClick={addRow}>
            เพิ่มวันหยุด
          </button>
          <button
            type="button"
            className="btn-primary rounded-xl px-5 py-2 disabled:opacity-60"
            onClick={handlePublish}
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      {/* Grid header (เฉพาะจอ md ขึ้นไป) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 rounded-xl px-3 py-2 text-xs font-medium text-black dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40">
        <div className="col-span-4">ชื่อวันหยุด</div>
        <div className="col-span-3">วันที่</div>
        <div className="col-span-4">หมายเหตุ</div>
        <div className="col-span-1 text-right">ลบ</div>
      </div>

      {/* Rows */}
      <div className="mt-3 space-y-3">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            role="group"
            aria-label={`แถวที่ ${idx + 1}`}
            className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 p-3 shadow-sm md:grid-cols-12 md:items-center"
          >
            {/* title */}
            <Field
              className="md:col-span-4"
              label={<span className="md:hidden">ชื่อวันหยุด</span>}
              placeholder="เช่น New Year"
              value={row.title}
              onChange={v => updateRow(row.id, { title: v })}
            />
            {/* date */}
            <Field
              className="md:col-span-3"
              label={<span className="md:hidden">วันที่</span>}
              type="date"
              placeholder="mm/dd/yyyy"
              value={row.date}
              onChange={v => updateRow(row.id, { date: v })}
            />
            {/* note */}
            <Field
              className="md:col-span-4"
              label={<span className="md:hidden">หมายเหตุ</span>}
              placeholder="(ถ้ามี)"
              value={row.note}
              onChange={v => updateRow(row.id, { note: v })}
            />
            {/* delete */}
            <div className="md:col-span-1 flex md:justify-end md:self-center">
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="rounded-xl border border-rose-300 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50/10 h-[42px] whitespace-nowrap"
                aria-label={`ลบแถวที่ ${idx + 1}`}
                title="ลบแถว"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      <div className="sr-only" aria-live="polite">{toast?.msg}</div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div className={`rounded-xl px-4 py-3 text-white ${toast.type === "success" ? "bg-emerald-600/90" : "bg-rose-600/90"}`}>
            {toast.msg}
            <button
              className="ml-3 border border-white/20 rounded px-2 text-xs"
              onClick={() => setToast(null)}
              aria-label="ปิดการแจ้งเตือน"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Reusable Field ---------- */
function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  inputProps,
  className,
}: {
  label?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string | number | "";
  onChange?: (v: string) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      {label ? <span className="mb-1 block text-sm text-slate-300">{label}</span> : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value as any}
        onChange={(e) => onChange?.(e.target.value)}
        className="neon-input w-full rounded-xl border border-white/10 bg-white/5 p-3 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
        {...inputProps}
      />
    </label>
  );
}
