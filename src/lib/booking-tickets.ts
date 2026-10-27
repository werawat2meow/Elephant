import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { deflateRawSync, inflateRawSync } from 'zlib';
import { validateBooking, type BookingInput } from './booking-validation';
import { captureBookingPricing, type BookingPricing } from './booking-pricing';

export type BookingTicket = { version: 1; requestId: string; expires: number; booking: BookingInput; pricing?: BookingPricing };
function key() {
  const secret = process.env.BOOKING_TICKET_SECRET || process.env.NEXTAUTH_SECRET || '';
  if (secret.length < 32) throw new Error('booking_ticket_secret_required');
  return createHash('sha256').update(secret).digest();
}
export function ticketReady() { try { key(); return true; } catch { return false; } }
export function requestsReady() { return ticketReady() && !!process.env.SITE_ORIGIN && !!process.env.LINE_CHANNEL_ACCESS_TOKEN && !!process.env.LINE_TO_ID; }
export function issueTicket(booking: BookingInput, requestId: string, now = Date.now()) {
  const payload: BookingTicket = { version: 1, requestId, expires: now + 7 * 86400000, booking, pricing: captureBookingPricing(booking, now) };
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(deflateRawSync(Buffer.from(JSON.stringify(payload)))), cipher.final()]);
  const token = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
  if (token.length > 4200) throw new Error('booking_notes_too_long');
  return token;
}
export function openTicket(token: string, now = Date.now()): BookingTicket {
  if (typeof token !== 'string' || token.length > 4200 || !/^[\w-]+$/.test(token)) throw new Error('invalid_ticket');
  const bytes = Buffer.from(token, 'base64url');
  if (bytes.length < 29) throw new Error('invalid_ticket');
  const decipher = createDecipheriv('aes-256-gcm', key(), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28));
  const compressed = Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]);
  const payload = JSON.parse(inflateRawSync(compressed, { maxOutputLength: 16000 }).toString('utf8')) as BookingTicket;
  if (payload.version !== 1 || !Number.isFinite(payload.expires) || payload.expires <= now || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(payload.requestId)) throw new Error('expired_or_invalid_ticket');
  if (!validateBooking(payload.booking, new Date(0)).data) throw new Error('invalid_booking');
  return payload;
}
