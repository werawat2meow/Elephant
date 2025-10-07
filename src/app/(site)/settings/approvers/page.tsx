"use client";

export default function ApproversPage() {
  return (
    <section role="tabpanel" aria-label="เพิ่มผู้มีสิทธิ์อนุมัติ" className="neon-card rounded-2xl p-6">
      <h2 className="neon-title text-lg font-semibold mb-4">เพิ่มผู้มีสิทธิ์อนุมัติ</h2>

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
