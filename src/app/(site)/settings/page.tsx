"use client";

import { useState } from "react";

type SettingsTab =
  | "profile"          // เพิ่มข้อมูล
  | "leave-rights"     // สิทธิ์การลาตามตำแหน่ง
  | "approvers"        // เพิ่มผู้มีสิทธิ์อนุมัติ
  | "holidays";        // ประกาศวันหยุดประจำปี

export default function SettingsPage() {
  // ค่าเริ่มต้น: "เพิ่มข้อมูล"
  const [tab, setTab] = useState<SettingsTab>("profile");

  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        {/* Tabs (top) */}
        <nav className="tabs-surface rounded-2xl p-2" role="tablist" aria-label="Settings tabs">
          <div className="flex flex-wrap gap-2">
            <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>
              เพิ่มข้อมูล
            </TabBtn>
            <TabBtn active={tab === "leave-rights"} onClick={() => setTab("leave-rights")}>
              สิทธิ์การลาตามตำแหน่ง
            </TabBtn>
            <TabBtn active={tab === "approvers"} onClick={() => setTab("approvers")}>
              เพิ่มผู้มีสิทธิ์อนุมัติ
            </TabBtn>
            <TabBtn active={tab === "holidays"} onClick={() => setTab("holidays")}>
              ประกาศวันหยุดประจำปี
            </TabBtn>
          </div>
        </nav>

        {/* Panel */}
        {tab === "profile" && (
          <section role="tabpanel" aria-label="เพิ่มข้อมูล" className="neon-card rounded-2xl p-6">
            <h2 className="neon-title text-lg font-semibold mb-4">เพิ่มข้อมูล</h2>

            {/* ตัวอย่างฟอร์ม — แก้/เติมจริงได้เลย */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="รหัสพนักงาน (EMP No.)" placeholder="เช่น EMP001" />
              <Field label="ชื่อ - สกุล" placeholder="ชื่อ-นามสกุล" />
              <Field label="ตำแหน่ง" placeholder="ตำแหน่งงาน" />
              <Field label="แผนก (Department)" placeholder="แผนก" />
              <Field label="ระดับ (Level P)" placeholder="P1 / P2 / P3 ..." />
              <Field label="อีเมล" type="email" placeholder="name@company.com" />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5">
                ยกเลิก
              </button>
              <button className="rounded-xl px-5 py-2 font-extrabold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)]">
                บันทึก
              </button>
            </div>
          </section>
        )}

        {tab === "leave-rights" && (
          <section role="tabpanel" aria-label="สิทธิ์การลาตามตำแหน่ง" className="neon-card rounded-2xl p-6">
            <h2 className="neon-title text-lg font-semibold mb-4">สิทธิ์การลาตามตำแหน่ง</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="ตำแหน่ง" placeholder="เช่น พนักงาน, หัวหน้าแผนก" />
              <Field label="Annual Leave (วัน/ปี)" type="number" placeholder="เช่น 10" />
              <Field label="Sick Leave (วัน/ปี)" type="number" placeholder="เช่น 30" />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5">
                เพิ่มรายการ
              </button>
              <button className="rounded-xl px-5 py-2 font-extrabold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)]">
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </section>
        )}

        {tab === "approvers" && (
          <section role="tabpanel" aria-label="เพิ่มผู้มีสิทธิ์อนุมัติ" className="neon-card rounded-2xl p-6">
            <h2 className="neon-title text-lg font-semibold mb-4">เพิ่มผู้มีสิทธิ์อนุมัติ</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="ชื่อ-สกุลผู้อนุมัติ" placeholder="เช่น นายสมชาย ใจดี" />
              <Field label="อีเมลผู้อนุมัติ" type="email" placeholder="boss@company.com" />
              <Field label="สายงาน/แผนก" placeholder="เช่น Production" />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5">
                เพิ่มผู้อนุมัติ
              </button>
              <button className="rounded-xl px-5 py-2 font-extrabold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)]">
                บันทึก
              </button>
            </div>
          </section>
        )}

        {tab === "holidays" && (
          <section role="tabpanel" aria-label="ประกาศวันหยุดประจำปี" className="neon-card rounded-2xl p-6">
            <h2 className="neon-title text-lg font-semibold mb-4">ประกาศวันหยุดประจำปี</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="ชื่อวันหยุด" placeholder="เช่น New Year" />
              <Field label="วันที่" type="date" />
              <Field label="หมายเหตุ" placeholder="(ถ้ามี)" />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5">
                เพิ่มวันหยุด
              </button>
              <button className="rounded-xl px-5 py-2 font-extrabold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)]">
                เผยแพร่
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* --------- Small components --------- */
function TabBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="tab-btn"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="neon-input w-full rounded-xl p-3"
      />
    </label>
  );
}
