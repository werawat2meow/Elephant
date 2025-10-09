"use client";
import { useEffect, useState } from "react";

type LeaveRow = {
  id: string;
  level: string;
  vacation: number | "";
  business: number | "";
  sick: number | "";
};

const makeRow = (seed: number = 1): LeaveRow => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  level: `P${seed}`,
  vacation: "",
  business: "",
  sick: "",
});

export default function LeaveRightsPage() {
  const [rows, setRows] = useState<LeaveRow[]>([makeRow(1)]);
  const LS_KEY = "leave-rights-rows";

  const [saving, setSaving] = useState(false);  
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LeaveRow[];
        if (Array.isArray(parsed) && parsed.length > 0) setRows(parsed);
      } catch {}
    }
    setHydrated(true); 
  }, []);

  const updateRow = (id: string, patch: Partial<LeaveRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, makeRow(prev.length + 1)]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const duplicateRow = (id: string) => {
    const src = rows.find((r) => r.id === id);
    if (!src) return;
    setRows((prev) => [
      ...prev,
      {
        ...makeRow(prev.length + 1),
        level: src.level,
        vacation: src.vacation,
        business: src.business,
        sick: src.sick,
      },
    ]);
  };

//   const handleSave = () => {
//   const normalized = rows.map(r => ({
//     ...r,
//     vacation: r.vacation === "" ? 0 : Number(r.vacation),
//     business: r.business === "" ? 0 : Number(r.business),
//     sick: r.sick === "" ? 0 : Number(r.sick),
//   }));
//   localStorage.setItem(LS_KEY, JSON.stringify(normalized));
//   console.log("SAVE ROWS =>", normalized);
// };

    const handleSave = () => {
    setSaving(true);
    try {
      const normalized = rows.map(r => ({
        ...r,
        vacation: r.vacation === "" ? 0 : Number(r.vacation),
        business: r.business === "" ? 0 : Number(r.business),
        sick: r.sick === "" ? 0 : Number(r.sick),
      }));
      localStorage.setItem("leave-rights-rows:v1", JSON.stringify(normalized));
      localStorage.setItem(LS_KEY, JSON.stringify(normalized));
      setToast({ type: "success", msg: `บันทึกแล้ว ${normalized.length} รายการ` });
    } catch (e) {
      setToast({ type: "error", msg: "บันทึกล้มเหลว กรุณาลองใหม่" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500); // ซ่อน toast อัตโนมัติ
    }
  };

  

  return (
    <section
      role="tabpanel"
      aria-label="สิทธิ์การลาตามตำแหน่ง"
      className="neon-card rounded-2xl p-6"
    >
      <h2 className="neon-title text-lg font-semibold mb-4">
        สิทธิ์การลาตามตำแหน่ง
      </h2>

      <div className="mt-2 space-y-3">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-3 shadow-sm md:grid-cols-12 md:items-center dark:border-slate-700"
            role="group"
            aria-label={`แถวที่ ${idx + 1}`}
          >
            {/* fields */}
            <div className="md:col-span-11 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-3">
              <Field
                label="Level P"
                placeholder="เช่น P1, P2, ผู้บริหาร"
                value={row.level}
                onChange={(v) => updateRow(row.id, { level: v })}
              />
              <Field
                label="ลาพักร้อน"
                type="number"
                placeholder="จำนวนวัน"
                value={row.vacation}
                onChange={(v) =>
                  updateRow(row.id, {
                    vacation: v === "" ? "" : Number(v),
                  })
                }
                inputProps={{ min: 0 }}
              />
              <Field
                label="ลากิจ"
                type="number"
                placeholder="จำนวนวัน"
                value={row.business}
                onChange={(v) =>
                  updateRow(row.id, {
                    business: v === "" ? "" : Number(v),
                  })
                }
                inputProps={{ min: 0 }}
              />
              <Field
                label="ลาป่วย"
                type="number"
                placeholder="จำนวนวัน"
                value={row.sick}
                onChange={(v) =>
                  updateRow(row.id, {
                    sick: v === "" ? "" : Number(v),
                  })
                }
                inputProps={{ min: 0 }}
              />
            </div>

            {/* row actions */}
            <div className="md:col-span-1 flex md:justify-end md:self-center pt-5">
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="rounded-xl border border-rose-300 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:border-rose-500/50 dark:text-rose-400 dark:hover:bg-rose-950/40 h-[42px] whitespace-nowrap"
                title="ลบแถว"
                aria-label="ลบแถว"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button type="button" className="btn-ghost" onClick={addRow}>
          เพิ่มรายการ
        </button>
        <button type="button" className="btn-primary disabled:opacity-60" onClick={handleSave} disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      <div className="sr-only" aria-live="polite">{toast?.msg}</div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div className={`rounded-xl px-4 py-3 text-white ${toast.type==="success" ? "bg-emerald-600/90" : "bg-rose-600/90"}`}>
            {toast.msg}
            <button className="ml-3 border border-white/20 rounded px-2 text-xs" onClick={() => setToast(null)} aria-label="ปิดการแจ้งเตือน">
              ปิด
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  inputProps,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number | "";
  onChange?: (v: string) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value as any}
        onChange={(e) => onChange?.(e.target.value)}
        className="neon-input w-full rounded-xl p-3"
        {...inputProps}
      />
    </label>
  );
}
