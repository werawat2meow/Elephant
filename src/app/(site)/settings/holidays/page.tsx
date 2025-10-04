"use client";

export default function HolidaysPage() {
  return (
    <section role="tabpanel" aria-label="ประกาศวันหยุดประจำปี" className="neon-card rounded-2xl p-6">
      <h2 className="neon-title text-lg font-semibold mb-4">ประกาศวันหยุดประจำปี</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="ชื่อวันหยุด" placeholder="เช่น New Year" />
        <Field label="วันที่" type="date" />
        <Field label="หมายเหตุ" placeholder="(ถ้ามี)" />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button className="btn-ghost">เพิ่มวันหยุด</button>
        <button className="btn-primary">เผยแพร่</button>
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
