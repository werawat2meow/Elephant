"use client";
import { useEffect } from "react";

export type LeaveHistoryItem = {
  no: number;
  type: string;
  range: string; // ช่วงวันที่ลา (เช่น 11-12/09/68)
  from: string;
  to: string;
  approverComment: string;
  approver: string;
  status: "approved" | "rejected" | "pending";
};

export default function LeaveHistoryModal({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: LeaveHistoryItem[];
}) {
  // Debug logging
  useEffect(() => {
    if (open) {
      console.log("📋 LeaveHistoryModal opened with items:", items);
      console.log("📋 Items length:", items.length);
    }
  }, [open, items]);

  // ปิดด้วย ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* stop close when click card */}
      <div
        className="w-[96vw] max-w-5xl neon-card rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="neon-title text-lg font-semibold">ประวัติการลา</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 border border-white/15 hover:bg-white/5"
            aria-label="ปิด"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg mb-2">ยังไม่มีประวัติการลา</p>
            <p className="text-sm">เมื่อคุณแจ้งลาแล้ว ประวัติจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="w-full history-table">
              <colgroup>
                <col className="col-num" />
                <col />
                <col />
                <col />
                <col />
                <col className="col-status" />
              </colgroup>

              <thead>
                <tr>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ลำดับ</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ประเภทการลา</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ช่วงวันที่ลา</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ความเห็นผู้อนุมัติ</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ผู้อนุมัติ</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold bg-white/5">ผลการอนุมัติ</th>
                </tr>
              </thead>

              <tbody>
                {items.map((r) => (
                  <tr key={r.no} className="odd:bg-white/0 even:bg-white/5">
                    <td className="px-3 py-2 text-center">{r.no}</td>
                    <td className="px-3 py-2 text-center">{r.type || '-'}</td>
                    <td className="px-3 py-2 text-center tabular-nums">{r.range || '-'}</td>
                    <td className="px-3 py-2 text-center">{r.approverComment || '-'}</td>
                    <td className="px-3 py-2 text-center">{r.approver || '-'}</td>
                    <td className="px-3 py-2 text-center">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 text-xs text-[var(--muted)]">
          * ข้อมูลดึงจากฐานข้อมูลจริง • รวม {items.length} รายการ
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "approved" | "rejected" | "pending";
}) {
  const config = {
    approved: {
      label: "อนุมัติ",
      className: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30"
    },
    rejected: {
      label: "ไม่อนุมัติ", 
      className: "bg-red-500/20 text-red-400 ring-red-500/30"
    },
    pending: {
      label: "รออนุมัติ",
      className: "bg-amber-500/20 text-amber-400 ring-amber-500/30"
    }
  };

  const { label, className } = config[status];
  
  return (
    <span className={`inline-block rounded-lg px-2 py-1 text-xs font-semibold ring-1 ${className}`}>
      {label}
    </span>
  );
}
