'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { BookingInput } from '../../../../lib/booking-validation';
import type { ApprovedQuote } from '../../../../lib/stripe-payments';
import type { ReviewPricing } from '../../../../lib/booking-pricing';

export default function AdminBookings() {
  const [ticket, setTicket] = useState(''), [booking, setBooking] = useState<BookingInput | null>(null);
  const [reference, setReference] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [pricing, setPricing] = useState<ReviewPricing | null>(null);
  const [quote, setQuote] = useState<ApprovedQuote>({ amountTHB: 0, operator: '', arrangements: '', cancellationTerms: '' });
  const [reviewed, setReviewed] = useState(false);
  const [receipt, setReceipt] = useState<{ status: string; sessionId: string; recipient?: string; checkoutUrl?: string; emailId?: string } | null>(null);
  const sending = useRef(false);
  useEffect(() => {
    let value = new URLSearchParams(window.location.hash.slice(1)).get('ticket') || '';
    try {
      if (value) sessionStorage.setItem('jasmine-review-ticket', value);
      else value = sessionStorage.getItem('jasmine-review-ticket') || '';
    } catch { /* Reopen the LINE link if browser storage is blocked. */ }
    if (!value) return;
    setTicket(value);
    window.history.replaceState(null, '', window.location.pathname);
    void (async () => {
      try {
        const response = await fetch('/api/admin/bookings/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'preview', ticket: value }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'preview_failed');
        setBooking(data.booking); setReference(data.reference);
        setPricing(data.pricing);
        setQuote(prev => ({ ...prev, amountTHB: data.pricing.totalTHB }));
        try {
          const saved = JSON.parse(sessionStorage.getItem(`jasmine-approval-${data.reference}`) || 'null');
          if (saved?.quote) setQuote(saved.quote);
          if (saved?.receipt?.sessionId) setReceipt(saved.receipt);
        } catch { /* The server validates every approval independently. */ }
      } catch { setError('เปิดข้อมูลไม่ได้: ตรวจล็อกอิน ลิงก์อาจหมดอายุ หรือค่าลับถูกเปลี่ยน / Could not open this review ticket. Reopen the LINE link after login.'); }
    })();
  }, []);
  async function approve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || !reviewed) return;
    sending.current = true; setBusy(true); setError('');
    try { sessionStorage.setItem(`jasmine-approval-${reference}`, JSON.stringify({ quote })); } catch {}
    try {
      const response = await fetch('/api/admin/bookings/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', ticket, quote, reviewed }) });
      const data = await response.json();
      if (!response.ok) throw new Error(`${data.message || 'ส่งไม่สำเร็จ'} (${data.error || 'failed'})`);
      setReceipt(data);
      try { sessionStorage.setItem(`jasmine-approval-${reference}`, JSON.stringify({ quote, receipt: data })); } catch {}
    } catch (e) { setError(e instanceof Error ? e.message : 'ยังยืนยันการส่งอีเมลไม่ได้ กรุณาลองใหม่ด้วยข้อมูลเดิม'); }
    finally { sending.current = false; setBusy(false); }
  }
  return <section className="max-w-4xl space-y-6"><h1 className="text-2xl font-bold">ตรวจคำขอและส่งอีเมลชำระเงิน</h1>
    <p>เปิดลิงก์ตรวจสอบจากข้อความ LINE เพื่อตรวจที่ว่าง ผู้ให้บริการ ราคา รถรับส่ง และเงื่อนไขก่อนกดส่งอีเมล ระบบยังไม่เรียกเก็บเงินจนกว่าลูกค้าจะเปิดลิงก์และชำระบน Stripe</p>
    {!ticket && <p className="bg-amber-50 p-4">ยังไม่ได้เปิดคำขอ โปรดใช้ลิงก์ตรวจสอบใน LINE ไม่มีรายการจองส่วนกลางหรือ Database บนเว็บไซต์</p>}
    {error && <p role="alert" className="bg-red-50 text-red-800 p-4 rounded">{error}</p>}
    {booking && <article className="bg-white border rounded p-5 space-y-3">
      <h2 className="font-bold break-all">{reference}</h2>
      <p>{pricing?.packageName || `โปรแกรม #${booking.packageId}`} · {booking.date} · {booking.time} (Phuket)</p>
      <p>ผู้ใหญ่ {booking.adults} / เด็ก {booking.children} / ทารก {booking.infants || 0}</p>
      {pricing && <section className="rounded-lg bg-green-50 p-4 space-y-2" aria-label="ราคาเบื้องต้นของคำขอ">
        <h3 className="font-semibold">{pricing.source === 'booking_snapshot' ? 'ราคาเบื้องต้น ณ ตอนส่งคำขอ' : 'ราคาเบื้องต้นจากตารางราคาปัจจุบัน'}</h3>
        {pricing.source === 'current_catalog' && <p className="text-sm text-amber-800">คำขอเก่านี้ไม่ได้บันทึกราคาเดิมไว้ จึงแสดงราคาคำนวณจากตารางปัจจุบัน กรุณาเทียบกับข้อความจองใน LINE</p>}
        <div className="flex justify-between gap-4"><span>ผู้ใหญ่ ฿{pricing.adultUnitTHB.toLocaleString()} × {booking.adults}</span><span>฿{(pricing.adultUnitTHB * booking.adults).toLocaleString()}</span></div>
        <div className="flex justify-between gap-4"><span>เด็ก ฿{pricing.childUnitTHB.toLocaleString()} × {booking.children}</span><span>฿{(pricing.childUnitTHB * booking.children).toLocaleString()}</span></div>
        <div className="flex justify-between gap-4 border-t border-green-200 pt-2 font-bold"><span>ยอดโปรแกรมเบื้องต้น</span><span className="text-green-800">฿{pricing.totalTHB.toLocaleString()}</span></div>
        <p className="text-sm text-gray-600">ยังไม่รวมค่ารถหรือค่าใช้จ่ายเพิ่มเติมที่ต้องตกลง ยอดเรียกเก็บจริงใช้ช่อง “ยอดสุดท้ายที่ตกลง” ด้านล่าง</p>
      </section>}
      <p>{booking.name} · {booking.email} · {booking.phone || '—'}</p>
      <p>โรงแรม: {booking.hotel || '—'} / ห้อง: {booking.roomNumber || '—'}</p>
      <p>รถรับส่ง: {booking.transferOption === 'no_transfer' ? 'ไม่รับส่ง' : 'ต้องการ — รอยืนยัน'}</p>
      <p>WhatsApp: {booking.whatsapp || '—'}<br />หมายเหตุ: {booking.notes || '—'}</p>
    </article>}
    {receipt ? <section className="border border-green-600 rounded p-5 space-y-3" aria-live="polite"><h2 className="text-xl font-bold">{receipt.status === 'PAID' ? 'รายการนี้ชำระแล้ว ไม่ส่งลิงก์เรียกเก็บซ้ำ' : 'ผลการส่งล่าสุด: รอชำระเงิน — ผู้ให้บริการรับส่งอีเมลแล้ว'}</h2>{receipt.recipient && <p>ผู้รับ: {receipt.recipient}</p>}<p className="break-all">Stripe: {receipt.sessionId}</p>{receipt.emailId && <p>Email ID: {receipt.emailId} — ตรวจการส่งถึง/ตีกลับในบริการอีเมล</p>}{receipt.checkoutUrl && <label className="block">ลิงก์เดิมสำหรับส่งต่อ WhatsApp หากลูกค้าขอ<input readOnly value={receipt.checkoutUrl} className="block w-full border p-2" onFocus={e => e.target.select()} /></label>}<p>อีเมลนี้แจ้งรายละเอียดและขอชำระ ยังไม่ใช่หลักฐานว่าลูกค้าจ่ายแล้ว ผลนี้เก็บเฉพาะแท็บนี้ ให้ตรวจสถานะล่าสุดใน Stripe</p></section> : booking && <form onSubmit={approve}><fieldset disabled={busy} className="space-y-4">
      <label className="block">ยอดสุดท้ายที่ตกลง (THB)<input required type="number" min="0.01" max="1000000" step="0.01" value={quote.amountTHB || ''} onChange={e => { setQuote(prev => ({ ...prev, amountTHB: Number(e.target.value) })); setReviewed(false); }} className="block w-full border rounded p-3" /></label>
      {pricing && quote.amountTHB > 0 && <p className="text-sm text-gray-700">ยอดเบื้องต้น ฿{pricing.totalTHB.toLocaleString()} → ยอดสุดท้าย ฿{quote.amountTHB.toLocaleString()} · ส่วนต่าง {quote.amountTHB >= pricing.totalTHB ? '+' : '−'}฿{(Math.round(Math.abs(quote.amountTHB - pricing.totalTHB) * 100) / 100).toLocaleString()}<br />หากมีค่ารถเพิ่ม ให้รวมในยอดสุดท้ายและแจกแจงในรายละเอียดรถรับส่งด้านล่าง</p>}
      {([['operator', 'ผู้ให้บริการและสถานที่จริง'], ['arrangements', 'วัน/เวลา รถรับส่ง สิ่งที่รวมและไม่รวมตามที่ตกลง'], ['cancellationTerms', 'เงื่อนไขยกเลิกและคืนเงินที่แจ้งลูกค้า']] as const).map(([key, label]) => <label className="block" key={key}>{label}<textarea required minLength={5} maxLength={600} value={quote[key]} onChange={e => setQuote(prev => ({ ...prev, [key]: e.target.value }))} className="block w-full border rounded p-3" /></label>)}
      <p>อีเมลจะส่งถึง <strong>{booking.email}</strong> พร้อมข้อมูลข้างต้นและลิงก์ Stripe ส่วนตัวของรายการนี้ ลิงก์มีอายุประมาณ 24 ชั่วโมง</p>
      <label className="flex gap-3 items-start"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} required className="mt-1" /><span>ตรวจสอบที่ว่าง ผู้ให้บริการ ราคา รถรับส่ง และเงื่อนไขเรียบร้อยแล้ว อนุมัติให้ส่งอีเมลเรียกชำระเงิน</span></label>
      <button disabled={busy || !reviewed} className="bg-green-700 text-white rounded px-6 py-3 disabled:opacity-50">{busy ? 'กำลังส่ง…' : 'ยืนยันและส่งอีเมลพร้อมลิงก์ชำระ'}</button>
    </fieldset></form>}
  </section>;
}
