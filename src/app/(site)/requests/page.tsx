"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LeaveHistoryModal, {
  LeaveHistoryItem,
} from "@/components/LeaveHistoryModal";

type LeaveType =
  | "Annual Leave"
  | "Sick Leave"
  | "Leave without pay"
  | "Maternity / Cremation / Military / Marriage Leave"
  | "Shift Change"
  | "Holiday Change"
  | "OT";

type EmployeeForm = {
  Nametitle?: string;
  empNo?: string;
  name?: string;
  position?: string;
  section?: string;
  department?: string;
  LevelP?: string;
};

type LeaveForm = {
  leaveType?: LeaveType;
  fromDate?: string;
  toDate?: string;
  session?: "Full Day" | "Morning (Half)" | "Afternoon (Half)";
  reason?: string;
  attachment?: File | null;
  contact?: string;
  handoverTo?: string;
};

const DEFAULT_HOLIDAYS: { no: number; name: string; date: string }[] = [
  { no: 1, name: "New Year", date: "2025-01-01" },
  { no: 2, name: "Makha Bucha", date: "2025-02-12" },
  { no: 3, name: "Songkran", date: "2025-04-13" },
  { no: 4, name: "Labor Day", date: "2025-05-01" },
  { no: 5, name: "Asarnha Bucha", date: "2025-07-09" },
  { no: 6, name: "King’s Birthday", date: "2025-07-28" },
  { no: 7, name: "Mother’s Day", date: "2025-08-12" },
  { no: 8, name: "Chulalongkorn Day", date: "2025-10-23" },
  { no: 9, name: "Father’s Day", date: "2025-12-05" },
  { no: 10, name: "Constitution Day", date: "2025-12-10" },
];

export default function LeavePage() {
  const router = useRouter();
  const [openHistory, setOpenHistory] = useState(false);

const history: LeaveHistoryItem[] = [
    {
      no: 1,
      type: "ลาป่วย",
      range: "11-12 / 09 / 68",
      from: "2025-09-11",
      to: "2025-09-12",
      approverComment: "xxxxxxxxxxxxxxxx",
      approver: "xxxxxxxxxx",
      status: "approved",
    },
    {
      no: 2,
      type: "ลากิจ",
      range: "11-12 / 09 / 68",
      from: "2025-09-11",
      to: "2025-09-12",
      approverComment: "xxxxxxxxxxxxxxxx",
      approver: "xxxxxxxxxx",
      status: "rejected",
    },
  ];

  const [emp, setEmp] = useState<EmployeeForm>({
    Nametitle: "นาย",
  });
  const [leave, setLeave] = useState<LeaveForm>({ session: "Full Day" });
  const [submitting, setSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);

  // คำนวณจำนวนวันลาแบบง่าย (รวมเสาร์อาทิตย์ไว้ก่อน)
  const totalDays = useMemo(() => {
    if (!leave.fromDate || !leave.toDate) return 0;
    const a = new Date(leave.fromDate);
    const b = new Date(leave.toDate);
    if (isNaN(+a) || isNaN(+b) || a > b) return 0;
    const diff = Math.round((+b - +a) / (1000 * 60 * 60 * 24)) + 1;
    if (leave.session?.includes("Half")) return Math.max(diff - 1 + 0.5, 0.5);
    return diff;
  }, [leave.fromDate, leave.toDate, leave.session]);

  function onChangeEmp<K extends keyof EmployeeForm>(k: K, v: EmployeeForm[K]) {
    setEmp((s) => ({ ...s, [k]: v }));
  }
  function onChangeLeave<K extends keyof LeaveForm>(k: K, v: LeaveForm[K]) {
    setLeave((s) => ({ ...s, [k]: v }));
  }

  function validate() {
    if (!emp.empNo || !emp.name) return "กรอกข้อมูลพนักงาน (รหัส/ชื่อ)";
    if (!leave.leaveType) return "เลือกประเภทการลา";
    if (!leave.fromDate || !leave.toDate) return "ระบุช่วงวันที่ลา";
    return "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    if (!agree) {
      alert("กรุณายืนยันว่าข้อมูลถูกต้อง");
      return;
    }
    setSubmitting(true);

    // ยังไม่มี backend: สาธิตการส่งข้อมูล
    const payload = { employee: emp, leave, totalDays };
    console.log("submit leave:", payload);

    // mock เสร็จ
    setTimeout(() => {
      setSubmitting(false);
      alert("ส่งคำขอลาสำเร็จ (ตัวอย่าง)");
      router.push("/dashboard");
    }, 800);
  }

  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex justify-end">
          <button
            onClick={() => setOpenHistory(true)}
            className="rounded-xl px-4 py-2 font-extrabold
             bg-[var(--cyan)] text-[#001418]
             shadow-[0_10px_28px_var(--cyan-soft)]
             hover:shadow-[0_14px_36px_var(--cyan-soft)]
             focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/50
             active:translate-y-[1px] transition"
          >
            ประวัติการลา
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 lg:grid-cols-3">
        {/* ฝั่งซ้าย: ข้อมูลพนักงาน + ประเภทการลา + ช่วงวัน */}
        <section className="lg:col-span-2 space-y-6">
          {/* ข้อมูลพนักงาน */}
          <div className="neon-card rounded-2xl p-5">
            <h2 className="neon-title mb-3 text-lg font-semibold">
              ข้อมูลพนักงาน
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="คำนำหน้าชื่อ"
                value={emp.Nametitle ?? ""}
                onChange={(v) => onChangeEmp("Nametitle", v)}
              />
              <Input
                label="วันที่ยื่น (Auto)"
                value={new Date().toLocaleDateString()}
                readOnly
              />
              <Input
                required
                label="รหัสพนักงาน (EMP No.)"
                value={emp.empNo ?? ""}
                onChange={(v) => onChangeEmp("empNo", v)}
              />
              <Input
                required
                label="ชื่อ - สกุล"
                value={emp.name ?? ""}
                onChange={(v) => onChangeEmp("name", v)}
              />
              <Input
                label="ตำแหน่ง"
                value={emp.position ?? ""}
                onChange={(v) => onChangeEmp("position", v)}
              />
              <Input
                label="Section"
                value={emp.section ?? ""}
                onChange={(v) => onChangeEmp("section", v)}
              />
              <Input
                label="Department"
                value={emp.department ?? ""}
                onChange={(v) => onChangeEmp("department", v)}
              />
              <Input
                label="Level P"
                value={emp.LevelP ?? ""}
                onChange={(v) => onChangeEmp("LevelP", v)}
              />
            </div>
          </div>

          {/* ประเภทการลา */}
          <div className="neon-card rounded-2xl p-5">
            <h2 className="neon-title mb-3 text-lg font-semibold">
              ประเภทการลา
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  "Public Holidays",
                  "Annual Leave",
                  "Sick Leave",
                  "Personal Leave",
                  "Relygious Leave",
                  "Monkhood Leave",
                  "Haji Leave",
                  "Birthday Leave",
                  "Leave without Pay",
                ] as LeaveType[]
              ).map((t) => (
                <label
                  key={t}
                  className={`rounded-xl border border-white/10 p-3 cursor-pointer transition ${
                    leave.leaveType === t
                      ? "bg-[var(--input)] ring-2 ring-[var(--cyan)]"
                      : "bg-transparent hover:bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="leaveType"
                    className="mr-2 accent-[var(--cyan)]"
                    checked={leave.leaveType === t}
                    onChange={() => onChangeLeave("leaveType", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* ช่วงวัน/เหตุผล/แนบไฟล์ */}
          <form
            onSubmit={onSubmit}
            className="neon-card rounded-2xl p-5 space-y-4"
          >
            <h2 className="neon-title mb-1 text-lg font-semibold">
              รายละเอียดการลา
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                required
                label="ตั้งแต่วันที่"
                type="date"
                value={leave.fromDate ?? ""}
                onChange={(v) => onChangeLeave("fromDate", v)}
              />
              <Input
                required
                label="ถึงวันที่"
                type="date"
                value={leave.toDate ?? ""}
                onChange={(v) => onChangeLeave("toDate", v)}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {["Full Day", "Morning (Half)", "Afternoon (Half)"].map((s) => (
                <label
                  key={s}
                  className={`rounded-xl border border-white/10 p-3 cursor-pointer ${
                    leave.session === s
                      ? "bg-[var(--input)] ring-2 ring-[var(--cyan)]"
                      : "hover:bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="session"
                    className="mr-2 accent-[var(--cyan)]"
                    checked={leave.session === s}
                    onChange={() =>
                      onChangeLeave("session", s as LeaveForm["session"])
                    }
                  />
                  {s}
                </label>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="ผู้อนุมัติ"
                value={leave.handoverTo ?? ""}
                onChange={(v) => onChangeLeave("handoverTo", v)}
              />
              <Input
                label="ช่องทางติดต่อระหว่างลา"
                value={leave.contact ?? ""}
                onChange={(v) => onChangeLeave("contact", v)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">เหตุผลการลา</label>
              <textarea
                className="neon-input w-full rounded-xl p-3"
                rows={3}
                value={leave.reason ?? ""}
                onChange={(e) => onChangeLeave("reason", e.target.value)}
                placeholder="เช่น ป่วย, ธุระจำเป็น, ลาคลอด, เปลี่ยนกะ, ฯลฯ"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                แนบไฟล์ประกอบ (ถ้ามี)
              </label>
              <input
                type="file"
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--cyan)] file:px-3 file:py-2 file:font-semibold file:text-[#001418]"
                onChange={(e) =>
                  onChangeLeave("attachment", e.target.files?.[0] ?? null)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-[var(--muted)]">
                รวมวันลา (ประมาณ):{" "}
                <span className="font-semibold text-[var(--text)]">
                  {totalDays}
                </span>{" "}
                วัน
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[var(--cyan)]"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                ยืนยันว่าข้อมูลถูกต้อง
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-5 py-2 font-semibold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)] disabled:opacity-50"
              >
                {submitting ? "กำลังส่ง..." : "ส่งคำขอลา"}
              </button>
            </div>
          </form>
        </section>

        {/* ฝั่งขวา: สิทธิวันลา + วันหยุดประจำปี */}
        <aside className="space-y-6">
          <div className="neon-card rounded-2xl p-5">
            <h2 className="neon-title mb-3 text-lg font-semibold">
              สิทธิวันลา (ตัวอย่าง/แก้ไขตามนโยบายบริษัท)
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-xl bg-[var(--input)] px-3 py-2">
                <span>Annual Leave</span>
                <b>10 วัน/ปี</b>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-[var(--input)] px-3 py-2">
                <span>Sick Leave</span>
                <b>30 วัน/ปี</b>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-[var(--input)] px-3 py-2">
                <span>Leave without pay</span>
                <b>ตามอนุมัติ</b>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-[var(--input)] px-3 py-2">
                <span>Special Leave</span>
                <b>ตามระเบียบ HR</b>
              </li>
            </ul>
          </div>

          <div className="neon-card rounded-2xl p-5">
            <h2 className="neon-title mb-3 text-lg font-semibold">
              วันหยุดประจำปี (Public Holidays)
            </h2>
            <div className="max-h-[360px] overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-3 py-2 text-left w-12">#</th>
                    <th className="px-3 py-2 text-left">ชื่อวันหยุด</th>
                    <th className="px-3 py-2 text-left">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {DEFAULT_HOLIDAYS.map((h) => (
                    <tr key={h.no} className="odd:bg-white/0 even:bg-white/5">
                      <td className="px-3 py-2">{h.no}</td>
                      <td className="px-3 py-2">{h.name}</td>
                      <td className="px-3 py-2">
                        {new Date(h.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              * รายการวันหยุดเป็นตัวอย่าง สามารถดึงจากฐานข้อมูลจริงได้ภายหลัง
            </p>
          </div>
        </aside>
      </div>
      <LeaveHistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        items={history}
      />
    </main>
  );
}

/* ---------- Reusable Input ---------- */
function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className={`neon-input w-full rounded-xl p-3 ${
          readOnly ? "opacity-70" : ""
        }`}
      />
    </label>
  );
}
