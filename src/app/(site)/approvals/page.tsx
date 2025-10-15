"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type LeaveStatus = "pending" | "approved" | "rejected";
type LeaveRequest = {
  id: string;
  empNo: string;
  name: string;
  org: string;
  dept: string;
  division: string;
  unit: string;
  leaveType: string;
  reason: string;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  levelP: string;
  status: LeaveStatus;
};

/* ---------------- Seed & constants ---------------- */
const LS_KEY = "approvals-requests:v1";
const seed: LeaveRequest[] = [
  { id: "L001", empNo: "EMP001", name: "สมชาย ใจดี", org: "สำนักงานใหญ่", dept: "พัฒนาระบบ", division: "เทคโนโลยี", unit: "ทีม A", leaveType: "ลาพักร้อน", reason: "ท่องเที่ยวประจำปี", from: "2025-10-15", to: "2025-10-18", levelP: "P4", status: "pending" },
  { id: "L002", empNo: "EMP002", name: "สุนีย์ สายบุญ", org: "โรงงาน 1", dept: "บุคคล", division: "สนับสนุน", unit: "ทีม HR", leaveType: "ลากิจ", reason: "ธุระครอบครัว", from: "2025-10-20", to: "2025-10-20", levelP: "P3", status: "pending" },
  { id: "L003", empNo: "EMP003", name: "อาทิตย์ อรุณรุ่ง", org: "สำนักงานใหญ่", dept: "เทคนิค", division: "บริการ", unit: "หน่วยเทคนิค", leaveType: "ลาป่วย", reason: "พบแพทย์ตามนัด", from: "2025-10-11", to: "2025-10-12", levelP: "P6", status: "pending" },
];

/* ---------------- Page ---------------- */
export default function ApprovalsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<LeaveRequest[]>(seed);

  // selection
  const [selectedId, setSelectedId] = useState<string | null>(null); // สำหรับ panel ด้านล่าง
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()); // สำหรับ bulk

  // filters
  const [q, setQ] = useState("");
  const [fOrg, setFOrg] = useState("");
  const [fDept, setFDept] = useState("");
  const [fDivision, setFDivision] = useState("");
  const [fUnit, setFUnit] = useState("");

  // toast
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // load + autosave
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LeaveRequest[];
        if (Array.isArray(parsed) && parsed.length) setData(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  // options
  const opts = useMemo(() => {
    const uniq = <K extends keyof LeaveRequest>(k: K) =>
      Array.from(new Set(data.map((x) => x[k]).filter(Boolean))).sort() as string[];
    return { org: uniq("org"), dept: uniq("dept"), division: uniq("division"), unit: uniq("unit") };
  }, [data]);

  // filter result
  const filtered = useMemo(() => {
    return data.filter((r) => {
      const hitQ = !q || [r.empNo, r.name, r.leaveType, r.reason].join(" ").toLowerCase().includes(q.toLowerCase());
      const hit = (!fOrg || r.org === fOrg) && (!fDept || r.dept === fDept) && (!fDivision || r.division === fDivision) && (!fUnit || r.unit === fUnit);
      return hitQ && hit;
    });
  }, [data, q, fOrg, fDept, fDivision, fUnit]);

  const selected = useMemo(() => data.find((d) => d.id === selectedId) || null, [data, selectedId]);

  // selection helpers
  const toggleRow = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const visibleIds = filtered.map((r) => r.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });

  // actions
  function updateStatus(ids: string[], status: LeaveStatus) {
    setData((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
    setToast({
      type: status === "approved" ? "success" : "error",
      msg: `${status === "approved" ? "อนุมัติ" : "ไม่อนุมัติ"}แล้ว ${ids.length} รายการ`,
    });
    setSelectedIds(new Set()); // clear selection
    setTimeout(() => setToast(null), 2000);
  }
  const approveIds = (ids: string[]) => updateStatus(ids, "approved");
  const rejectIds = (ids: string[]) => updateStatus(ids, "rejected");

  return (
    <section className="neon-card rounded-2xl p-6 text-slate-900 dark:text-slate-100">
      <h2 className="neon-title text-lg font-semibold">รายการคำขอลา</h2>

      {/* Filters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select label="สังกัด" value={fOrg} onChange={setFOrg} options={opts.org} />
        <Select label="แผนก" value={fDept} onChange={setFDept} options={opts.dept} />
        <Select label="ฝ่าย" value={fDivision} onChange={setFDivision} options={opts.division} />
        <Select label="หน่วย" value={fUnit} onChange={setFUnit} options={opts.unit} />
        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300">ค้นหา</label>
          <input
            placeholder="ชื่อ / EMP No. / เหตุผล"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border p-3
                       border-slate-300 bg-white text-slate-900 placeholder-slate-400
                       focus:border-slate-400 focus:ring-2 focus:ring-slate-300/60
                       dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100
                       dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700/40"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">เลือกรายการ: {selectedIds.size}</div>
        <div className="flex gap-2">
          <button
            className="rounded-lg px-3 py-1 text-sm
                       bg-emerald-600 text-white hover:bg-emerald-700
                       disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            onClick={() => approveIds(Array.from(selectedIds))}
            disabled={selectedIds.size === 0}
          >
            อนุมัติที่เลือก
          </button>
          <button
            className="rounded-lg px-3 py-1 text-sm
                       bg-rose-600 text-white hover:bg-rose-700
                       disabled:opacity-50 dark:bg-rose-500 dark:hover:bg-rose-600"
            onClick={() => rejectIds(Array.from(selectedIds))}
            disabled={selectedIds.size === 0}
          >
            ไม่อนุมัติที่เลือก
          </button>
        </div>
      </div>

      {/* Table (responsive + higher contrast in light) */}
      <div className="mt-3 rounded-xl border overflow-x-auto
                      border-slate-300 bg-white shadow-sm
                      dark:border-white/10 dark:bg-white/5">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-100 text-slate-800 text-center
                            dark:bg-slate-900/40 dark:text-slate-300">
            <tr>
              <Th className="w-10">
                <input
                  type="checkbox"
                  aria-label="เลือกทั้งหมด"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                />
              </Th>
              <Th>ลำดับ</Th>
              <Th>ชื่อ - สกุล</Th>
              <Th className="hidden md:table-cell">ประเภทลา</Th>
              <Th className="hidden lg:table-cell">รายละเอียดการลา</Th>
              <Th className="hidden sm:table-cell">Level P</Th>
              <Th className="hidden sm:table-cell">สถานะ</Th>
              <Th className="text-right pr-3">Approve</Th>
            </tr>
          </thead>
          <tbody className="text-slate-800 dark:text-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => {
                const checked = selectedIds.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`border-t border-slate-200 hover:bg-slate-50/70
                                dark:border-white/5 dark:hover:bg-white/10 cursor-pointer ${
                                  selectedId === r.id ? "bg-slate-50/70 dark:bg-white/10" : ""
                                }`}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <Td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`เลือก ${r.name}`}
                        checked={checked}
                        onChange={() => toggleRow(r.id)}
                      />
                    </Td>
                    <Td className="text-center">{i + 1}</Td>
                    <Td>
                      <div className="font-medium text-slate-900 dark:text-slate-100 text-left">{r.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 text-left">
                        {r.empNo} • {r.org}/{r.dept}/{r.division}/{r.unit}
                      </div>
                    </Td>
                    <Td className="hidden md:table-cell text-center">{r.leaveType}</Td>
                    <Td className="hidden lg:table-cell text-left">
                      {fmtDate(r.from)} – {fmtDate(r.to)}
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{r.reason}</div>
                    </Td>
                    <Td className="hidden sm:table-cell text-center">{r.levelP}</Td>
                    <Td className="hidden sm:table-cell text-center">
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td className="text-right pr-3">
                      <div className="inline-flex gap-2 sm:gap-3">
                        <button
                          className="rounded-lg px-3 py-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700
                                     dark:bg-emerald-500 dark:hover:bg-emerald-600"
                          onClick={(e) => { e.stopPropagation(); approveIds([r.id]); }}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="rounded-lg px-3 py-1 text-sm bg-rose-600 text-white hover:bg-rose-700
                                     dark:bg-rose-500 dark:hover:bg-rose-600"
                          onClick={(e) => { e.stopPropagation(); rejectIds([r.id]); }}
                        >
                          ไม่อนุมัติ
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details Panel */}
      <div className="mt-6 rounded-2xl border p-4 border-slate-300 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-base font-semibold mb-3">รายละเอียดคำขอ</h3>
        {selected ? (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ReadField label="ชื่อ - สกุล (ผู้ขอ)" value={`${selected.name} • ${selected.empNo}`} />
              <ReadField
                label="องค์กร / แผนก / ฝ่าย / หน่วย"
                value={`${selected.org} / ${selected.dept} / ${selected.division} / ${selected.unit}`}
              />
              <ReadField label="Level P" value={selected.levelP} />
              <ReadField label="ประเภทลา" value={selected.leaveType} />
              <ReadField label="วันที่ลา" value={`${fmtDate(selected.from)} - ${fmtDate(selected.to)}`} />
              <ReadField label="สถานะ" value={<StatusBadge status={selected.status} />} />
            </div>
            <div>
              <div className="mb-1 text-sm text-slate-700 dark:text-slate-300">รายละเอียด (เหตุผลการลา)</div>
              <div className="rounded-xl border p-3 border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-100">
                {selected.reason || "-"}
              </div>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="rounded-xl px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
                onClick={() => rejectIds([selected.id])}
              >
                ไม่อนุมัติ
              </button>
              <button
                className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                onClick={() => approveIds([selected.id])}
              >
                อนุมัติ
              </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400">เลือกแถวจากตารางด้านบนเพื่อดูรายละเอียด</div>
        )}
      </div>

      {/* Toast */}
      <div className="sr-only" aria-live="polite">{toast?.msg}</div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div className={`rounded-xl px-4 py-3 text-white ${toast.type === "success" ? "bg-emerald-600/90" : "bg-rose-600/90"}`}>
            {toast.msg}
            <button className="ml-3 border border-white/20 rounded px-2 text-xs" onClick={() => setToast(null)} aria-label="ปิดการแจ้งเตือน">ปิด</button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Small components ---------------- */
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[]; }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3
                   border-slate-300 bg-white text-slate-900
                   focus:border-slate-400 focus:ring-2 focus:ring-slate-300/60
                   dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700/40"
      >
        <option value="">ทั้งหมด</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 ${className}`}>{children}</th>;
}
function Td({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLTableCellElement>; }) {
  return <td className={`px-3 py-2 align-top ${className}`} onClick={onClick}>{children}</td>;
}
function ReadField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-sm text-slate-700 dark:text-slate-300">{label}</div>
      <div className="rounded-xl border p-2 border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-100">{value}</div>
    </div>
  );
}
function StatusBadge({ status }: { status: LeaveStatus }) {
  const map: Record<LeaveStatus, string> = {
    pending:  "bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40",
    approved: "bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40",
    rejected: "bg-rose-200 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/40",
  };
  const label = status === "pending" ? "รออนุมัติ" : status === "approved" ? "อนุมัติแล้ว" : "ไม่อนุมัติ";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${map[status]}`}>{label}</span>;
}

/* ---------------- Utils ---------------- */
function fmtDate(s: string) {
  if (!s) return "-";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}
