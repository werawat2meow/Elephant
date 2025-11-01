"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------- Types ---------- */
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
  hrConfirmed?: boolean; // HR ยืนยันแล้วหรือยัง
};

const LS_KEY = "approvals-requests:v1";

/* ---------- Page ---------- */
export default function HRConfirmRecheckPage() {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<LeaveRequest[]>([]);

  // filter
  const [fOrg, setFOrg] = useState("");
  const [fDept, setFDept] = useState("");
  const [fDivision, setFDivision] = useState("");
  const [fUnit, setFUnit] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // toggle view
  const [showConfirmed, setShowConfirmed] = useState(false);

  // selection (bulk)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // toast
  const [toast, setToast] =
    useState<{ type: "success" | "error"; msg: string } | null>(null);

  /* ---------- Load/Save ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LeaveRequest[];
        setData(parsed.map((r) => ({ hrConfirmed: false, ...r })));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  /* ---------- Helpers ---------- */
  const withinRange = (from: string, to: string) => {
    if (!dateFrom && !dateTo) return true;
    const s = new Date(from).getTime();
    const e = new Date(to).getTime();
    const df = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
    const dt = dateTo ? new Date(dateTo).getTime() : +Infinity;
    return !(e < df || s > dt); // ซ้อนทับช่วงอย่างน้อย 1 วัน
  };

  // options
  const opts = useMemo(() => {
    const uniq = <K extends keyof LeaveRequest>(k: K) =>
      Array.from(new Set(data.map((x) => x[k]).filter(Boolean))).sort() as string[];
    return {
      org: uniq("org"),
      dept: uniq("dept"),
      division: uniq("division"),
      unit: uniq("unit"),
    };
  }, [data]);

  // lists
  const waitingList = useMemo(
    () =>
      data.filter(
        (r) =>
          r.status === "approved" &&
          !r.hrConfirmed &&
          (!fOrg || r.org === fOrg) &&
          (!fDept || r.dept === fDept) &&
          (!fDivision || r.division === fDivision) &&
          (!fUnit || r.unit === fUnit) &&
          withinRange(r.from, r.to)
      ),
    [data, fOrg, fDept, fDivision, fUnit, dateFrom, dateTo]
  );

  const confirmedList = useMemo(
    () =>
      data.filter(
        (r) =>
          r.status === "approved" &&
          r.hrConfirmed === true &&
          (!fOrg || r.org === fOrg) &&
          (!fDept || r.dept === fDept) &&
          (!fDivision || r.division === fDivision) &&
          (!fUnit || r.unit === fUnit) &&
          withinRange(r.from, r.to)
      ),
    [data, fOrg, fDept, fDivision, fUnit, dateFrom, dateTo]
  );

  // ใช้ list ตามโหมดที่เลือก
  const list = showConfirmed ? confirmedList : waitingList;

  // selection helpers
  const visibleIds = list.map((r) => r.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  const toggleRow = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ---------- Actions ---------- */
  function confirmHR(ids: string[]) {
    if (ids.length === 0) return;
    setData((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, hrConfirmed: true } : r)));
    setSelectedIds(new Set());
    setToast({ type: "success", msg: `ยืนยันแล้ว ${ids.length} รายการ` });
    setTimeout(() => setToast(null), 2000);
  }
  function undoConfirm(ids: string[]) {
    if (ids.length === 0) return;
    setData((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, hrConfirmed: false } : r)));
    setSelectedIds(new Set());
    setToast({ type: "success", msg: `ยกเลิกยืนยันแล้ว ${ids.length} รายการ` });
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <section className="neon-card rounded-2xl p-6 text-slate-900 dark:text-slate-100">
      <h2 className="neon-title text-lg font-semibold">HR Confirm Recheck</h2>

      {/* Filters */}
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Select label="สังกัด" value={fOrg} onChange={setFOrg} options={opts.org} />
        <Select label="แผนก" value={fDept} onChange={setFDept} options={opts.dept} />
        <Select label="ฝ่าย" value={fDivision} onChange={setFDivision} options={opts.division} />
        <Select label="หน่วย" value={fUnit} onChange={setFUnit} options={opts.unit} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">วันที่จาก</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-xl border p-3
                         border-slate-300 bg-white text-slate-900
                         dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">ถึงวันที่</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-xl border p-3
                         border-slate-300 bg-white text-slate-900
                         dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Bulk bar + toggle */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          {showConfirmed
            ? `ยืนยันแล้ว ${confirmedList.length} รายการ • เลือกแล้ว ${selectedIds.size}`
            : `รอ HR ยืนยัน ${waitingList.length} รายการ • เลือกแล้ว ${selectedIds.size}`}
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50
                       dark:border-white/10 dark:hover:bg-white/5"
            onClick={() => setShowConfirmed((v) => !v)}
          >
            {showConfirmed ? "ดูรายการรอยืนยัน" : "ดูรายการที่ยืนยันแล้ว"}
          </button>

          {showConfirmed ? (
            <button
              className="rounded-lg border border-amber-300 px-3 py-1 text-sm text-amber-700 hover:bg-amber-50
                         disabled:opacity-50 dark:border-amber-500/50 dark:text-amber-300 dark:hover:bg-amber-900/30"
              onClick={() => undoConfirm(Array.from(selectedIds))}
              disabled={selectedIds.size === 0}
            >
              ยกเลิกยืนยันที่เลือก
            </button>
          ) : (
            <button
              className="rounded-lg border border-emerald-300 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50
                         disabled:opacity-50 dark:border-emerald-500/50 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
              onClick={() => confirmHR(Array.from(selectedIds))}
              disabled={selectedIds.size === 0}
            >
              ยืนยันที่เลือก
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 rounded-xl border overflow-hidden
                      border-slate-200 bg-white
                      dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
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
              <Th>ใช้สิทธิ์ลา</Th>
              <Th>รายละเอียดการลา</Th>
              <Th className="text-center">Level P</Th>
              <Th className="text-right pr-3">{showConfirmed ? "ยกเลิก" : "ยืนยัน"}</Th>
            </tr>
          </thead>

          <tbody className="text-slate-900 dark:text-slate-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  {showConfirmed ? "ไม่มีรายการที่ยืนยันแล้ว" : "ไม่มีรายการรอยืนยันจาก HR"}
                </td>
              </tr>
            ) : (
              list.map((r, i) => {
                const checked = selectedIds.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className="border-t border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <Td>
                      <input
                        type="checkbox"
                        aria-label={`เลือก ${r.name}`}
                        checked={checked}
                        onChange={() => toggleRow(r.id)}
                      />
                    </Td>
                    <Td>{i + 1}</Td>
                    <Td>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {r.empNo} • {r.org}/{r.dept}/{r.division}/{r.unit}
                      </div>
                    </Td>
                    <Td>{r.leaveType}</Td>
                    <Td>
                      {fmtDate(r.from)} – {fmtDate(r.to)}
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {r.reason}
                      </div>
                    </Td>
                    <Td className="text-center">{r.levelP}</Td>
                    <Td className="text-right pr-3">
                      {showConfirmed ? (
                        <button
                          className="rounded-lg border border-amber-300 px-3 py-1 text-sm text-amber-700 hover:bg-amber-50
                                     dark:border-amber-500/50 dark:text-amber-300 dark:hover:bg-amber-900/30"
                          onClick={() => undoConfirm([r.id])}
                        >
                          ยกเลิก
                        </button>
                      ) : (
                        <button
                          className="rounded-lg border border-emerald-300 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50
                                     dark:border-emerald-500/50 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                          onClick={() => confirmHR([r.id])}
                        >
                          ยืนยัน
                        </button>
                      )}
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      <div className="sr-only" aria-live="polite">{toast?.msg}</div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div
            className={`rounded-xl px-4 py-3 text-white ${
              toast.type === "success" ? "bg-emerald-600/90" : "bg-rose-600/90"
            }`}
          >
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

/* ---------- Small components ---------- */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3
                   border-slate-300 bg-white text-slate-900
                   dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
      >
        <option value="">ทั้งหมด</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}

/* ---------- Utils ---------- */
function fmtDate(s: string) {
  if (!s) return "-";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}
