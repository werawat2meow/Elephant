import Link from 'next/link';
import { pageMetadata, site } from '../../lib/site';
export const metadata = pageMetadata('Privacy Notice & Visitor Analytics', 'How Jasmine Tour handles local booking drafts, optional analytics and enquiries that you choose to send through LINE.', '/privacy-policy');
export default function PrivacyPolicy() {
  return <article className="max-w-3xl mx-auto p-6 py-12 space-y-5">
    <h1 className="text-3xl font-bold">Privacy notice · การใช้ข้อมูลลูกค้า</h1>
    <p>Operator / ผู้ประกอบการ: {site.operator || 'Awaiting owner verification'}. Privacy contact: {site.email || 'Awaiting a verified contact email'}.</p>
    <h2 className="text-xl font-bold">Booking drafts / แบบร่างคำขอจอง</h2>
    <p>แบบฟอร์มใช้ชื่อ อีเมล เบอร์โทร โปรแกรม วันที่ รอบเวลา จำนวนคน และข้อมูลโรงแรม เลขห้อง WhatsApp รถรับส่งหรือหมายเหตุที่เลือกกรอก เมื่อกดส่งคำขอ ข้อมูลจะถูกส่งเข้า LINE ของทีมงานเพื่อเช็กที่ว่างและเงื่อนไข ยังไม่มีการเรียกเก็บเงิน ทีมงานเปิดลิงก์ตรวจสอบที่เข้ารหัสและมีอายุ 7 วัน โดยต้องล็อกอินแอดมินก่อนอ่านข้อมูล</p>
    <p>Initial requests are sent to the staff LINE recipient with an encrypted, expiring review ticket. There is no separate booking database. After staff approve availability, the provider, final price, pickup and terms, booking details are stored with a Stripe Checkout Session. A transactional email provider sends the agreed details and payment link to the email in your request. After verified payment, LINE and a separate email notify staff and the customer. Notification markers are stored on Stripe PaymentIntents to manage retries.</p>
    <p>ข้อมูลบัตรกรอกบน Stripe เท่านั้น ไม่ส่งข้อมูลบัตรเข้า LINE หรือบริการอีเมล ผู้ให้บริการอีเมลจะประมวลผลที่อยู่อีเมล ชื่อ รายละเอียดจอง เงื่อนไข และลิงก์ชำระเพื่อส่งข้อความให้คุณ การได้รับลิงก์ชำระยังไม่ใช่หลักฐานว่าจ่ายแล้ว</p>
    <h2 className="text-xl font-bold">Browser storage / ข้อมูลบนอุปกรณ์</h2>
    <p>The draft is saved in this browser tab using session storage so it can survive reloads. It is not shared across devices and is not a booking receipt. Use Clear saved draft to reset it. Your language and optional analytics choice are stored locally. The website has no central booking history or status tracker.</p>
    <p>แอดมินที่ตั้งค่าไว้เข้าสู่ระบบด้วย session cookie ไม่มีการเก็บข้อมูลบัญชีลูกค้าหรือคำขอจองในฐานข้อมูลของเว็บไซต์ ผู้ให้บริการโฮสติ้งอาจเก็บบันทึกการเข้าถึงเว็บไซต์ตามการตั้งค่าของบริการ</p>
    <h2 className="text-xl font-bold">LINE enquiries / ข้อความที่ส่งใน LINE</h2>
    <p>LINE and the receiving business process the submitted notification. Staff use it to answer the enquiry and agree booking arrangements. The business must complete its verified identity, privacy contact, retention period, legal grounds and handling of access/correction/deletion requests. Any sharing with a tour provider must be explained before it occurs. These business details are still awaiting owner approval.</p>
    <h2 className="text-xl font-bold">Optional analytics / การวิเคราะห์ที่เลือกอนุญาต</h2>
    <p>If Google Analytics is configured, it loads only after you allow it. It measures page views, Book Now / LINE clicks, accepted booking-request submissions and optional copy actions. Form entries and notification text are not intentionally included in analytics events. Google may process device and network information. Use Analytics preferences to change your choice; clearing browser site data removes existing local identifiers and cookies.</p>
    <p><Link href="/contact" className="underline">Contact information / ช่องทางติดต่อ</Link></p>
  </article>;
}
