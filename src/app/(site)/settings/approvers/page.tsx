"use client";

import { useState } from "react";
import ApproverListModal, { type Approver } from "@/components/ApproverListModal";

const MOCK_APPROVERS: Approver[] = [
  { id: "1", empNo: "EMP201", name: "สมชาย ใจดี", dept: "การเงิน", level: "P3" },
  { id: "2", empNo: "EMP245", name: "สุนีย์ สายบุญ", dept: "บุคคล", level: "P2" },
  { id: "3", empNo: "EMP318", name: "อาทิตย์ อรุณรุ่ง", dept: "เทคนิค", level: "P4" },
];

export default function ApproversPage() {
  const [open, setOpen] = useState(false);
  const handlePick = (a: Approver) => {
    console.log("เลือกผู้อนุมัติ:", a);
        // TODO: setState ให้ช่องที่ต้องการ เช่น:
    // setEmpNo(a.empNo); setName(a.name); setDept(a.dept ?? "");
  }
  return (
    <section role="tabpanel" aria-label="เพิ่มผู้มีสิทธิ์อนุมัติ" className="neon-card rounded-2xl p-6">
      <div className="mb-4 flex item-center justify-between gap-3">
        <h2 className="neon-title text-lg font-semibold mb-4">เพิ่มผู้มีสิทธิ์อนุมัติ</h2>
        <button
          type="button"
          className="neon-title cursor-pointer rounded-xl px-4 py-2 border border-slate-3000 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          onClick={() => setOpen(true)}
        >
          รายชื่อผู้มีสิทธิ์อนุมัติ
        </button>
      </div>


      <div className="grid gap-4 md:grid-cols-3">
        <Field label="คำนำหน้าชื่อ" placeholder="" />
        <Field label="ชื่อ (ไทย - อังกฤษ)" placeholder="" />
        <Field label="นามสกุล (ไทย - อังกฤษ)" placeholder="" />
        <Field label="รหัสพนักงาน" placeholder="" />
        <Field label="บัตรประชาชน" placeholder="" />
        <Field label="สังกัด" placeholder="" />
        <Field label="แผนก" placeholder="" />
        <Field label="ฝ่าย" placeholder="" />
        <Field label="หน่วย" placeholder="" />
        <Field label="Level P" placeholder="" />
        <Field label="Line ID" placeholder="" />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button className="btn-ghost">เพิ่มผู้อนุมัติ</button>
        <button className="btn-primary">บันทึก</button>
      </div>
      <ApproverListModal
        open={open}
        onClose={() => setOpen(false)}
        approvers={MOCK_APPROVERS}
        onSelect={handlePick}
      />
    </section>
  );
}

function Field({ label, type = "text", placeholder }:{
  label: string; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm">{label}</span>
      <input type={type} placeholder={placeholder} className="neon-input w-full rounded-xl p-3" />
    </label>
  );
}
