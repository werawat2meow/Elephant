"use client";

export default function LeaveRightsPage() {
  return (
    <section role="tabpanel" aria-label="สิทธิ์การลาตามตำแหน่ง" className="neon-card rounded-2xl p-6">
      <h2 className="neon-title text-lg font-semibold mb-4">สิทธิ์การลาตามตำแหน่ง</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="ตำแหน่ง" placeholder="เช่น พนักงาน, หัวหน้าแผนก" />
        <Field label="Annual Leave (วัน/ปี)" type="number" placeholder="เช่น 10" />
        <Field label="Sick Leave (วัน/ปี)" type="number" placeholder="เช่น 30" />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button className="btn-ghost">เพิ่มรายการ</button>
        <button className="btn-primary">บันทึกการเปลี่ยนแปลง</button>
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
