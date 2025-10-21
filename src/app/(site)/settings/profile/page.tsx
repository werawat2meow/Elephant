"use client";

import { useEffect, useRef, useState } from "react";
import EmployeeListModal, { type Employee } from "@/components/EmployeeListModal";


const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", empNo: "EMP001", name: "สมชาย ใจดี", dept: "พัฒนาระบบ" },
  { id: "2", empNo: "EMP002", name: "สุนีย์ สายบุญ", dept: "ฝ่ายบุคคล" },
  { id: "3", empNo: "EMP003", name: "อาทิตย์ อรุณรุ่ง", dept: "หน่วยเทคนิค" },
];

export default function ProfileSettingsPage() {
  // --- รูปพนักงาน ---
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = () => inputRef.current?.click();
  const [openEmpModal, setOpenEmpModal] = useState(false);


  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    setPhotoFile(f);
  }

  // drag & drop
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    setPhotoFile(f);
  }
  const onDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  // preview URL
  useEffect(() => {
    if (!photoFile) { setPhotoUrl(null); return; }
    const url = URL.createObjectURL(photoFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  function removePhoto() {
    setPhotoFile(null);
    setPhotoUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section role="tabpanel" aria-label="เพิ่มข้อมูล" className="neon-card rounded-2xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="neon-title text-base sm:text-lg font-semibold mb-4">เพิ่มข้อมูล</h2>
        <button
        type="button"
        className="neon-title rounded-xl px-4 py-2 border border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer"
        onClick={() => setOpenEmpModal(true)}
        >
          รายชื่อพนักงาน
        </button>
      </div>
      

      {/* NOTE: ทำ responsive ที่นี่
          - โมบาย: 1 คอลัมน์ (รูปอยู่บน, ฟอร์มอยู่ล่าง)
          - md:   2 คอลัมน์ (ซ้ายรูป 280-320px, ขวาฟอร์มยืด)
          - lg+:  คงแบบ md แต่เพิ่มช่องฟอร์มได้มากขึ้น */}
      <div className="grid gap-6 md:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        {/* ซ้าย: อัปโหลด/แสดงรูป */}
        <div className="min-w-0">
          <div
            onDrop={onDrop}
            onDragOver={onDrag}
            onDragEnter={onDrag}
            className="rounded-2xl border border-white/10 bg-[var(--input)] p-4 text-center"
          >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/20 flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Employee photo preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-[var(--muted)] text-sm whitespace-normal break-words">
                  ยังไม่มีรูป
                  <div className="mt-1 opacity-80">You can drag and drop images here.</div>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />

            <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={pickFile} className="btn btn-soft">
                เพิ่มรูป
              </button>
              {photoUrl && (
                <button type="button" onClick={removePhoto} className="btn btn-outline">
                  ลบรูป
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-[var(--muted)] break-words">
              รองรับไฟล์ภาพ เช่น JPG, PNG (แนะนำขนาดสี่เหลี่ยมจัตุรัส)
            </p>
          </div>
        </div>

        {/* ขวา/ด้านล่าง: ฟอร์มข้อมูล */}
        {/* ปรับกริดฟอร์ม: 
            - xs: 1 คอลัมน์
            - sm: 2 คอลัมน์
            - lg: 3 คอลัมน์ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
          <Field label="คำนำหน้าชื่อ" placeholder="เช่น นาย / นาง / นางสาว" />
          <Field label="ชื่อ" placeholder="ชื่อ" />
          <Field label="นามสกุล" placeholder="นามสกุล" />

          <Field label="รหัสพนักงาน (EMP No.)" placeholder="เช่น EMP001" />
          <Field label="บัตรประชาชน" placeholder="เลขบัตรประชาชน" />
          <Field label="สังกัด" placeholder="สังกัด" />

          <Field label="แผนก" placeholder="แผนก" />
          <Field label="ฝ่าย" placeholder="ฝ่าย" />
          <Field label="หน่วย" placeholder="หน่วย" />

          <Field label="Level P" placeholder="P1 / P2 / P3 ..." />
          <Field label="สิทธิ์ลาป่วย" placeholder="(อายุงาน + ตำแหน่ง)" />
          <Field label="สิทธิ์ลาพักร้อน" placeholder="(อายุงาน + ตำแหน่ง)" />

          <Field label="สิทธิ์ลากิจ" placeholder="(อายุงาน + ตำแหน่ง)" />
          <Field label="สิทธิ์ลาบวช" placeholder="จำนวนวัน" />
          <Field label="สิทธิ์ลาคลอด" placeholder="จำนวนวัน" />

          <Field label="ลาโดยไม่ได้รับค่าจ้าง" placeholder="จำนวนวัน" />
          <Field label="ลาวันเกิด" placeholder="จำนวนวัน" />
          <Field label="วันหยุดประจำปี" placeholder="(จำนวนวัน)" />

          <Field label="Line ID" placeholder="@lineid" />
          <Field label="เริ่มงานวันที่" type="date" />
          <Field label="วันหยุดประจำสัปดาห์ (Default)" placeholder="ตัวอย่าง วันอาทิตย์" />
        </div>
      </div>

      {/* ปุ่ม */}
      <div className="mt-5 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button type="button" className="rounded-xl px-4 py-2 border border-white/10 hover:bg-white/5">
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={() => alert("ตัวอย่าง: เก็บไฟล์รูปไว้ใน state แล้ว พร้อมส่งด้วย FormData ได้")}
          className="rounded-xl px-5 py-2 font-extrabold bg-[var(--cyan)] text-[#001418] shadow-[0_10px_28px_var(--cyan-soft)]"
        >
          บันทึก
        </button>
      </div>
      <EmployeeListModal
        open={openEmpModal}
        onClose={() => setOpenEmpModal(false)}
        employees={MOCK_EMPLOYEES}
      />
    </section>
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
    <label className="block min-w-0"> {/* min-w-0 กัน overflow ตอนอยู่ใน grid */}
      <span className="mb-1 block text-sm whitespace-normal break-words">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="neon-input w-full rounded-xl p-3"
      />
    </label>
  );
}
