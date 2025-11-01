"use client";

import { useEffect, useState } from "react";

export type Approver = {
    id: string;
    empNo: string;
    name: string;
    dept?: string;
    level?: string;
};

export default function ApproverListModal({
    open,
    onClose,
    approvers,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    approvers: Approver[];
    onSelect?: (p: Approver) => void;
}) {
    const [q, setQ] = useState("");

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    
    if (!open) return null;
    
    const list = approvers.filter(a =>
        [a.empNo, a.name, a.dept ?? "", a.level ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(q.toLowerCase())
    );
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 p-4 shadow-2xl dark:border-white/10 dark:bg-[#0b1220] dark:text-slate-100"
                onClick={e => e.stopPropagation()}>
                <div className="neon-title mb-3 flex items-center justify-between">
                    <h3 className="neon-title text-lg font-semibold">รายชื่อผู้มีสิทธิ์อนุมัติ</h3>
                    <button onClick={onClose} className="neon-title rounded-xl px-3 py-1 border boder-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer">
                        ปิด
                    </button>
                </div>
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="ค้นหา:ชื่อ"
                    className="w-full rounded-xl p-3 border border-slate-300 bg-white text-white-900 placeholder-slate-400
                    dark:border-slate-700 dark:bg-slate-800/80 dak:text-slate-100 dark:placeholder-slate-500"
                />

                <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden dark:border-white/10">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                            <tr>
                                <th className="px-3 py-2 text-left">EMP No.</th>
                                <th className="px-3 py-2 text-left">ชื่อ</th>
                                <th className="px-3 py-2 text-left">แผนก/หน่วย</th>
                                <th className="px-3 py-2 text-left">level/ตำแหน่ง</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">
                                        ไม่พบรายการ
                                    </td>
                                </tr>
                            ): (
                                list.map(a => (
                                    <tr key={a.id} className="border-t border-slate-200 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5">
                                        <td className="px-3 py-2">{a.empNo}</td>
                                        <td className="px-3 py-2">{a.name}</td>
                                        <td className="px-3 py-2">{a.dept ?? "-"}</td>
                                        <td className="px-3 py-2">{a.level ?? "-"}</td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                            className="rounded-lg border boder-slate-300 px-3 py-1 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer"
                                            onClick={() => { onSelect?.(a); onClose(); }}>
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
    )
}