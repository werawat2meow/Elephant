import { validateBooking } from './booking-validation';
import { tours } from './tours';

export function prepareBookingMessage(input: unknown, now = new Date()) {
  const checked = validateBooking(input, now);
  if (!checked.data) return { errors: checked.errors, message: '' };
  const data = checked.data;
  const tour = tours.find(t => t.id === data.packageId)!;
  const estimate = tour.price.adult * data.adults + tour.price.child * data.children;
  const message = [
    '📩 New Booking Request / คำขอจองใหม่ — Jasmine Tour',
    'Not a confirmed booking or proof of payment / ยังไม่ยืนยันจองหรือชำระเงิน',
    `Tour: ${tour.name.en} / ${tour.name.th}`,
    `Preferred date: ${data.date}`, `Proposed time: ${data.time} (Phuket)`,
    `Adults: ${data.adults} / Children: ${data.children} / Infants: ${data.infants || 0}`,
    `Indicative total: THB ${estimate.toLocaleString('en-US')} (subject to operator confirmation)`,
    `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone || '—'}`,
    `Pickup: ${data.transferOption === 'no_transfer' ? 'Not requested / ไม่รับส่ง' : 'Requested; area and fee to confirm / ต้องการรถรับส่ง รอยืนยันพื้นที่และราคา'}`,
    `Hotel: ${data.hotel || '—'}`, `Room: ${data.roomNumber || '—'}`, `WhatsApp: ${data.whatsapp || '—'}`, `Notes: ${data.notes || '—'}`,
    'Please confirm the provider, location, availability, final quote, child conditions, pickup, inclusions/exclusions and cancellation/refund terms.',
  ].join('\n');
  return { errors: [], message };
}
