"use client";

import { useEffect, useState } from "react";

export type Employee = { id:string; empNo: string; name: string; dept?: string };

export default function EmployeeListModal ({
    open,
    onClose,
    employees,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    employees: Employee[];
    onSelect?: (emp: Employee) => void;
}) {
    const [q, setQ] = useState("");

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const list = employees.filter(
        (e) =>
            e.empNo.toLowerCase().includes(q.toLowerCase()) ||
            e.name.toLowerCase().includes(q.toLowerCase()) ||
            (e.dept || "").toLowerCase().includes(q.toLowerCase())
    );

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-white text-slate-900 p-4 shadow-2xl dark:bg-[#0b1220] dark:text-slate-100" onClick={(e)=>e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">รายชื่อพนักงาน</h3>
          <button onClick={onClose} className="rounded-xl px-3 py-1 border border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
            ปิด
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหา: ชื่อ / EMP No. / แผนก"
          className="neon-input w-full rounded-xl p-3 border border-slate-300 bg-white text-slate-900 placeholder-slate-400
                     dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500"
        />

        <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left">EMP No.</th>
                <th className="px-3 py-2 text-left">ชื่อพนักงาน</th>
                <th className="px-3 py-2 text-left">แผนก/หน่วย</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">ไม่พบรายการ</td></tr>
              ) : (
                list.map((e) => (
                  <tr key={e.id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5">
                    <td className="px-3 py-2">{e.empNo}</td>
                    <td className="px-3 py-2">{e.name}</td>
                    <td className="px-3 py-2">{e.dept || "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                        onClick={() => { onSelect?.(e); onClose(); }}
                      >
                        เลือก
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}