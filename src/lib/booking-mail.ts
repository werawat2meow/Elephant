export function mailReady() { return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM; }
export async function sendBookingMail(to: string, subject: string, text: string, idempotencyKey: string) {
  if (!mailReady()) throw new Error('email_not_configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text, ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}) }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('email_provider_failed');
  const data = await response.json();
  if (typeof data.id !== 'string') throw new Error('email_acceptance_unverified');
  return data.id as string;
}
