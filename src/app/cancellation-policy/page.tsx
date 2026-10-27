import { pageMetadata, site } from '../../lib/site';
export const metadata = pageMetadata('Booking, Cancellation & Refund Policy', 'How LINE booking enquiries, operator confirmation, cancellation and refund enquiries work at Jasmine Tour. No online payments are accepted.', '/cancellation-policy');
export default function CancellationPolicy() {
  return <article className="max-w-3xl mx-auto p-6 py-12 space-y-5">
    <h1 className="text-3xl font-bold">Booking, cancellation & refunds</h1>
    <p>เงื่อนไขคำขอจอง การยกเลิก และคืนเงิน</p>
    <h2 className="text-xl font-bold">Enquiries and status / คำขอและสถานะ</h2>
    <p>ส่งคำขอให้ทีมงานตรวจที่ว่างก่อน ระบบจะแจ้งคำขอเข้า LINE ยังไม่เรียกเก็บเงิน หลังทีมงานตรวจสอบและอนุมัติรายละเอียดแล้ว จะส่งอีเมลพร้อมผู้ให้บริการ ราคาสุดท้าย รถรับส่ง เงื่อนไข และลิงก์ชำระด้วยบัตร ประวัติการชำระเก็บกับ Stripe โดยไม่มีฐานข้อมูลแยกในเว็บไซต์</p>
    <p>รอตรวจสอบ = ส่งคำขอแล้ว ยังไม่ยืนยันที่นั่งหรือชำระเงิน<br />รอชำระเงิน = เจ้าหน้าที่อนุมัติรายละเอียดและส่งอีเมลลิงก์ชำระแล้ว ยังไม่ใช่หลักฐานการชำระเงิน<br />ชำระแล้ว = Stripe ยืนยันรับชำระและระบบส่งอีเมลยืนยันรับชำระ โดยใช้รายละเอียดที่ทีมงานอนุมัติ<br />ยกเลิก = ติดต่อทีมงานตามเงื่อนไขที่ตกลง การยกเลิกไม่ได้หมายความว่าคืนเงินแล้ว</p>
    <p>Card payments are processed on Stripe when configured. The website checks payment with Stripe before showing success or notifying staff. Confirmation of attendance arrangements, changes and cancellations is handled by staff. A paid status and a LINE notification are distinct from a refund or cancellation agreement.</p>
    <h2 className="text-xl font-bold">Before confirmation / ก่อนยืนยัน</h2>
    <p>Jasmine Tour acts as a booking agent. The actual provider, location, date, final adult and child price, age bands, inclusions, exclusions and pickup must be agreed before confirmation.</p>
    <p>Legal operator / ผู้ประกอบการ: {site.operator || 'ยังไม่ประกาศ — awaiting owner verification'}</p>
    <h2 className="text-xl font-bold">Cancellation and refund terms / ยกเลิกและคืนเงิน</h2>
    <p>ขณะนี้ยังไม่ประกาศระยะเวลายกเลิก ค่าธรรมเนียม เงื่อนไขกรณีไม่มา สภาพอากาศ การยกเลิกโดยปาง หรือกรอบเวลาคืนเงิน ต้องได้รับเงื่อนไขจากผู้ให้บริการและแจ้งให้ลูกค้าตกลงก่อนรับเงิน ห้ามถือว่าการส่งคำขอได้รับสิทธิ์คืนเงินฟรีหรือคืนเงินอัตโนมัติ</p>
    <p>Cancellation deadlines, fees, no-show rules, weather or operator cancellation arrangements and refund times await provider approval. Obtain these in writing before agreeing to a booking or paying. Cancellation alone does not authorise or prove a refund.</p>
    <p>To request a change or cancellation, use the verified Contact channel and identify your original enquiry reference or confirmation. If submitting a request fails, keep your entries and retry; the form will not show success while the LINE API reports failure.</p>
  </article>;
}
