"use client";

import { Leave } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

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

const LS_KEY = "approvals-request:v1";
const seed: LeaveRequest[] = [
  { id: "L001", empNo: "EMP001", name: "สมชาย ใจดี", org: "สำนักงานใหญ่", dept: "พัฒนาระบบ", division: "เทคโนโลยี", unit: "ทีม A", leaveType: "ลาพักร้อน", reason: "ท่องเที่ยวประจำปี", from: "2025-10-15", to: "2025-10-18", levelP: "P4", status: "pending" },
  { id: "L002", empNo: "EMP002", name: "สุนีย์ สายบุญ", org: "โรงงาน 1", dept: "บุคคล", division: "สนับสนุน", unit: "ทีม HR", leaveType: "ลากิจ", reason: "ธุระครอบครัว", from: "2025-10-20", to: "2025-10-20", levelP: "P3", status: "pending" },
  { id: "L003", empNo: "EMP003", name: "อาทิตย์ อรุณรุ่ง", org: "สำนักงานใหญ่", dept: "เทคนิค", division: "บริการ", unit: "หน่วยเทคนิค", leaveType: "ลาป่วย", reason: "พบแพทย์ตามนัด", from: "2025-10-11", to: "2025-10-12", levelP: "P6", status: "pending" },
];

 export default function ApprovalsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<LeaveRequest[]>(seed);

  // selection
  const [selectedId, setSelectedId] = useState<string | null>(null); // สำหรับ panel ด้านล่าง
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()); // สำหรับ bulk

  const [q, setQ] = useState("");
  const [fOrg, setFOrg] = useState("");
  const [fDept, setFDept] = useState("");
  const [fDivision, setFDivision] = useState("");
  const [fUnit, setFUnit] = useState("");

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  useEffect (() => {
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

  const opts = useMemo(() => {
    const uniq =<K extends keyof LeaveRequest>(k: K) =>
      Array.from(new Set(data.map((x) => x[k]).filter(Boolean))).sort() as string[];
    return { org: uniq("org"), dept: uniq("dept"), division: uniq("division"), unit: uniq("unit") };
  }, [data]);

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
        setSelectedIds((_) => new Set()); // clear selection
        setTimeout(() => setToast(null), 2000);
      }
      const approveIds = (ids: string[]) => updateStatus(ids, "approved");
      const rejectIds = (ids: string[]) => updateStatus(ids, "rejected");

      return (
        <section className="neon-card rounded-2xl p-6 text-slate-900 dark:text-slate-100">
          <h2 className="neon-title text-lg font-semibold">รายการคำขอลา</h2>

          {/* Filters */}
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {/* <Select label="สังกัด" value={fOrg} onChange={setFOrg} options={opts.org} />
            <Select label="แผนก" value={fDept} onChange={setFDept} options={opts.dept} />
            <Select label="ฝ่าย" value={fDivision} onChange={setFDivision} options={opts.division} />
            <Select label="หน่วย" value={fUnit} onChange={setFUnit} options={opts.unit} /> */}

            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300">ค้นหา</label>
              <input
                placeholder="ชื่อ / EMP No. / เหตุผล"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl border p-3
                       border-slate-300 bg-white text-slate-900 placeholder-slate-400
                       dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </section>
      )
 }