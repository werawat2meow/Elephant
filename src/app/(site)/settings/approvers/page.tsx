"use client";

export default function ApproversPage() {
  return (
    <section role="tabpanel" aria-label="เพิ่มผู้มีสิทธิ์อนุมัติ" className="neon-card rounded-2xl p-6">
      <h2 className="neon-title text-lg font-semibold mb-4">เพิ่มผู้มีสิทธิ์อนุมัติ</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="ชื่อ-สกุลผู้อนุมัติ" placeholder="เช่น นายสมชาย ใจดี" />
        <Field label="อีเมลผู้อนุมัติ" type="email" placeholder="boss@company.com" />
        <Field label="สายงาน/แผนก" placeholder="เช่น Production" />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button className="btn-ghost">เพิ่มผู้อนุมัติ</button>
        <button className="btn-primary">บันทึก</button>
      </div>
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
