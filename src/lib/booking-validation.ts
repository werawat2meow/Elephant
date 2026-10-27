import { tours } from './tours';

export type BookingInput = {
  packageId: number; date: string; time: string;
  adults: number; children: number; name: string; email: string; phone: string;
  hotel: string; notes: string; acknowledged: boolean;
  infants?: number; roomNumber?: string; whatsapp?: string; transferOption?: 'requested' | 'no_transfer';
};
export function phuketToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function validateBooking(value: unknown, now = new Date()): { data?: BookingInput; errors: string[] } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['Invalid request / ข้อมูลไม่ถูกต้อง'] };
  const v = value as Record<string, unknown>;
  const errors: string[] = [];
  const tour = tours.find(t => t.id === v.packageId);
  if (!tour) errors.push('Choose a valid tour / เลือกโปรแกรม');
  if (['cardDetails', 'cardNumber', 'cvc'].some(key => key in v)) errors.push('Do not send card details / ไม่รับข้อมูลบัตร');
  const date = typeof v.date === 'string' ? v.date : '';
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date < phuketToday(now)) errors.push('Choose a valid date today or later (Phuket) / วันที่ต้องไม่ย้อนหลัง');
  if (typeof v.time !== 'string' || !tour?.times.includes(v.time)) errors.push('Choose a proposed time / เลือกรอบเวลา');
  if (!Number.isInteger(v.adults) || Number(v.adults) < 1 || Number(v.adults) > 30) errors.push('Adults must be 1–30 / ผู้ใหญ่ 1–30 คน');
  if (!Number.isInteger(v.children) || Number(v.children) < 0 || Number(v.children) > 30 || Number(v.adults) + Number(v.children) > 30) errors.push('Maximum 30 participants / รวมไม่เกิน 30 คน');
  const infants = v.infants === undefined ? 0 : v.infants;
  if (!Number.isInteger(infants) || Number(infants) < 0 || Number(v.adults) + Number(v.children) + Number(infants) > 30) errors.push('Maximum 30 guests including infants / รวมทารกแล้วไม่เกิน 30 คน');
  const text = (key: string, max: number, required = false) => {
    const raw = v[key];
    const result = typeof raw === 'string' ? raw.trim() : '';
    if ((raw !== undefined && typeof raw !== 'string') || result.length > max || (required && !result)) errors.push(`Invalid ${key} / ตรวจสอบ ${key}`);
    return result;
  };
  const name = text('name', 100, true), email = text('email', 254, true), phone = text('phone', 30);
  const hotel = text('hotel', 200), notes = text('notes', 1000);
  const roomNumber = text('roomNumber', 50), whatsapp = text('whatsapp', 50);
  const transferOption = v.transferOption === undefined ? 'requested' : v.transferOption;
  if (transferOption !== 'requested' && transferOption !== 'no_transfer') errors.push('Invalid pickup option / ตรวจสอบตัวเลือกรถรับส่ง');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email / อีเมลไม่ถูกต้อง');
  if (phone && (!/^[+\d()\s.-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7)) errors.push('Invalid phone / เบอร์โทรไม่ถูกต้อง');
  if (v.acknowledged !== true) errors.push('Read and acknowledge the request terms / โปรดรับทราบเงื่อนไข');
  if (errors.length) return { errors };
  return { errors, data: { packageId: v.packageId as number, date, time: v.time as string, adults: v.adults as number, children: v.children as number, infants: infants as number, name, email, phone, hotel, roomNumber, whatsapp, transferOption: transferOption as 'requested' | 'no_transfer', notes, acknowledged: true } };
}
