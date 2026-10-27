// Offline workflow checks. All Stripe, LINE and email calls are mocked.
const assert = require('node:assert/strict'), fs = require('node:fs'), Module = require('node:module'), ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file);
let admin = false, createArgs, creates = 0, session, payment;
const fakeStripe = {
  checkout: { sessions: { create: async (...args) => { creates++; createArgs = args; return { id: 'cs_test_example', url: 'https://checkout.stripe.com/test', status: 'open', payment_status: 'unpaid', expires_at: 4102444800 }; }, retrieve: async () => session } },
  paymentIntents: { retrieve: async () => payment, update: async (id, params) => { Object.assign(payment.metadata, params.metadata); return payment; } },
  webhooks: { constructEvent: (raw, signature) => { if (signature !== 'offline-valid') throw new Error('invalid'); return JSON.parse(raw.toString()); } },
};
const load = Module._load;
Module._load = function(id, parent, main) {
  if (id === 'stripe') return function StripeMock() { return fakeStripe; };
  if (id === 'next-auth/jwt') return { getToken: async () => admin ? { email: 'admin@example.com' } : null };
  return load.call(this, id, parent, main);
};
const { validateBooking } = require('../src/lib/booking-validation.ts');
const tickets = require('../src/lib/booking-tickets.ts');
const helpers = require('../src/lib/stripe-payments.ts');
const requestApi = require('../src/app/api/booking-notify/route.ts');
const reviewApi = require('../src/app/api/admin/bookings/review/route.ts');
const statusApi = require('../src/app/api/payments/status/route.ts');
const webhookApi = require('../src/app/api/webhooks/stripe/route.ts');
const valid = { packageId: 2, date: '2099-10-27', time: '9:00 AM', adults: 2, children: 1, name: 'Test Guest', email: 'customer@example.com', phone: '+66812345678', hotel: 'Test hotel', notes: '', acknowledged: true, requestId: '12345678-1234-4234-8234-123456789abc' };
const quote = { amountTHB: 4300, operator: 'Verified provider and location', arrangements: 'Confirmed date, pickup and included activities', cancellationTerms: 'Agreed cancellation and refund conditions' };
const post = (path, body, origin = 'http://localhost:3000') => new Request('http://localhost:3000' + path, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
let count = 0, calls = [], failEmail = false, failLine = false;
async function check(name, fn) { await fn(); count++; console.log('PASS ' + name); }
const nativeFetch = global.fetch;
global.fetch = async (url, options) => {
  calls.push({ url, options, data: JSON.parse(options.body) });
  if (url === 'https://api.resend.com/emails') return new Response(JSON.stringify({ id: 'email_test_accepted' }), { status: failEmail ? 500 : 200 });
  if (url === 'https://api.line.me/v2/bot/message/push') return new Response('{}', { status: failLine ? 500 : 200 });
  throw new Error('Unexpected external URL: ' + url);
};
(async () => {
  const fixed = new Date('2026-10-26T10:00:00Z');
  await check('valid booking', () => assert.ok(validateBooking(valid, fixed).data));
  for (const [name, patch] of [['past date', { date: '2026-10-25' }], ['bad calendar date', { date: '2027-02-30' }], ['zero adults', { adults: 0 }], ['too many guests', { adults: 30, children: 1 }], ['card data', { cardDetails: {} }], ['bad email', { email: 'bad' }], ['missing consent', { acknowledged: false }]]) await check('reject ' + name, () => assert.ok(validateBooking({ ...valid, ...patch }, fixed).errors.length));
  Object.assign(process.env, { BOOKING_TICKET_SECRET: 'offline-test-secret-at-least-thirty-two-characters', NEXTAUTH_SECRET: 'offline-auth-secret-at-least-thirty-two-characters', ADMIN_EMAIL: 'admin@example.com', LINE_CHANNEL_ACCESS_TOKEN: 'offline-line-token', LINE_TO_ID: 'offline-recipient', SITE_ORIGIN: 'https://tours.example' });
  const booking = validateBooking(valid).data;
  const token = tickets.issueTicket(booking, valid.requestId);
  await check('ticket decrypts but contains no plain customer email', () => { assert.equal(tickets.openTicket(token).booking.email, valid.email); assert.ok(!token.includes(valid.email)); });
  await check('booking price snapshot survives later catalogue changes', () => {
    const { reviewBookingPricing } = require('../src/lib/booking-pricing.ts');
    const tour = require('../src/lib/tours.ts').tours.find(item => item.id === valid.packageId);
    const originalPrice = tour.price.adult;
    try {
      tour.price.adult += 100;
      const pricing = reviewBookingPricing(tickets.openTicket(token));
      assert.equal(pricing.source, 'booking_snapshot');
      assert.equal(pricing.adultUnitTHB, 1600); assert.equal(pricing.childUnitTHB, 1000); assert.equal(pricing.totalTHB, 4200);
    } finally { tour.price.adult = originalPrice; }
  });
  await check('legacy tickets clearly label current-price fallback', () => {
    const { reviewBookingPricing } = require('../src/lib/booking-pricing.ts');
    const pricing = reviewBookingPricing({ booking });
    assert.equal(pricing.source, 'current_catalog'); assert.equal(pricing.totalTHB, 4200);
  });
  await check('tampered and expired tickets rejected', () => { const altered = (token[0] === 'A' ? 'B' : 'A') + token.slice(1); assert.throws(() => tickets.openTicket(altered)); assert.throws(() => tickets.openTicket(tickets.issueTicket(booking, valid.requestId, 1))); });
  await check('foreign request cannot notify LINE', async () => { assert.equal((await requestApi.POST(post('/api/booking-notify', valid, 'https://other.example'))).status, 403); assert.equal(calls.length, 0); });
  await check('request notifies LINE only, without charging or emailing', async () => {
    const res = await requestApi.POST(post('/api/booking-notify', valid)); const data = await res.json();
    assert.equal(res.status, 200); assert.equal(data.status, 'PENDING_REVIEW'); assert.equal(creates, 0);
    assert.equal(calls.length, 1); assert.equal(calls[0].url, 'https://api.line.me/v2/bot/message/push');
    assert.ok(calls[0].data.messages[0].text.includes('ยังไม่ยืนยันจองหรือชำระเงิน'));
    assert.ok(calls[0].data.messages[1].text.includes('/admin/bookings#ticket='));
    assert.ok(!JSON.stringify(data).includes(token));
  });
  await check('retry key is stable for the same booking', async () => { await requestApi.POST(post('/api/booking-notify', valid)); assert.equal(calls[0].options.headers['X-Line-Retry-Key'], calls[1].options.headers['X-Line-Retry-Key']); });
  await check('LINE failure never reports received', async () => { failLine = true; assert.equal((await requestApi.POST(post('/api/booking-notify', valid))).status, 503); failLine = false; });
  const reviewBody = { action: 'approve', ticket: token, quote, reviewed: true, recipient: 'attacker@example.com' };
  await check('unauthenticated review and email are blocked', async () => assert.equal((await reviewApi.POST(post('/api/admin/bookings/review', reviewBody))).status, 403));
  admin = true;
  await check('staff preview sends no email or payment request', async () => { const before = calls.length; const res = await reviewApi.POST(post('/api/admin/bookings/review', { action: 'preview', ticket: token })); assert.equal(res.status, 200); assert.equal((await res.json()).booking.email, valid.email); assert.equal(calls.length, before); assert.equal(creates, 0); });
  await check('staff must explicitly confirm review', async () => assert.equal((await reviewApi.POST(post('/api/admin/bookings/review', { ...reviewBody, reviewed: false }))).status, 400));
  await check('missing email configuration stops approval before Stripe creation', async () => { delete process.env.RESEND_API_KEY; assert.equal((await reviewApi.POST(post('/api/admin/bookings/review', reviewBody))).status, 503); assert.equal(creates, 0); });
  Object.assign(process.env, { PAYMENTS_ENABLED: 'true', STRIPE_SECRET_KEY: 'sk_test_offline', STRIPE_WEBHOOK_SECRET: 'whsec_offline', RESEND_API_KEY: 'offline-resend', EMAIL_FROM: 'Jasmine Tour <bookings@example.com>' });
  await check('approval creates agreed-price checkout and emails only signed customer', async () => {
    const res = await reviewApi.POST(post('/api/admin/bookings/review', reviewBody)); const data = await res.json();
    assert.equal(res.status, 200); assert.equal(data.status, 'AWAITING_PAYMENT');
    assert.equal(createArgs[0].line_items[0].price_data.unit_amount, 430000);
    const email = calls.find(c => c.url === 'https://api.resend.com/emails');
    assert.deepEqual(email.data.to, [valid.email]); assert.ok(email.data.text.includes('https://checkout.stripe.com/test')); assert.ok(email.data.text.includes(quote.cancellationTerms));
    assert.ok(email.data.text.includes('not proof of payment'));
  });
  const approvedArgs = createArgs;
  await check('retry approval reuses Stripe and email idempotency keys', async () => { const emailKey = calls.find(c => c.url.includes('resend')).options.headers['Idempotency-Key']; await reviewApi.POST(post('/api/admin/bookings/review', reviewBody)); assert.equal(createArgs[1].idempotencyKey, approvedArgs[1].idempotencyKey); assert.equal(calls.at(-1).options.headers['Idempotency-Key'], emailKey); });
  await check('invalid final price or missing operator terms stops approval', async () => { const before = creates; const res = await reviewApi.POST(post('/api/admin/bookings/review', { ...reviewBody, quote: { ...quote, amountTHB: 0 } })); assert.equal(res.status, 503); assert.equal(creates, before); });
  await check('email failure never reports sent', async () => { failEmail = true; assert.equal((await reviewApi.POST(post('/api/admin/bookings/review', reviewBody))).status, 503); failEmail = false; });
  await check('public checkout cannot bypass staff approval', async () => assert.equal((await require('../src/app/api/payments/create-checkout/route.ts').POST()).status, 403));
  session = { id: 'cs_test_example', metadata: approvedArgs[0].metadata, mode: 'payment', status: 'complete', payment_status: 'unpaid', currency: 'thb', amount_total: 430000, payment_intent: 'pi_offline' };
  payment = { status: 'succeeded', currency: 'thb', amount_received: 430000, metadata: {} };
  const accessKey = new URLSearchParams(new URL(approvedArgs[0].success_url).hash.slice(1)).get('booking_key');
  const statusRequest = key => new Request('http://localhost:3000/api/payments/status?session_id=cs_test_example', { headers: { 'x-booking-key': key } });
  await check('emailed checkout can verify on another device with return capability', () => assert.ok(helpers.ownsSession(session, accessKey)));
  await check('wrong capability blocked and unpaid stays unpaid', async () => { assert.equal((await statusApi.GET(statusRequest(valid.requestId))).status, 404); const data = await (await statusApi.GET(statusRequest(accessKey))).json(); assert.equal(data.paid, false); });
  session.payment_status = 'paid'; calls = [];
  await check('verified payment sends LINE and paid-confirmation email with Stripe markers', async () => { const data = await (await statusApi.GET(statusRequest(accessKey))).json(); assert.equal(data.paid, true); assert.equal(data.notificationPending, false); assert.equal(data.booking.email, valid.email); assert.equal(calls.length, 2); assert.equal(payment.metadata.jasmine_line_notified, session.id); assert.equal(payment.metadata.jasmine_paid_email, session.id); });
  await check('repeat payment verification sends no duplicate messages', async () => { await statusApi.GET(statusRequest(accessKey)); assert.equal(calls.length, 2); });
  await check('paid email failure keeps paid state and retries email without another LINE', async () => { delete payment.metadata.jasmine_paid_email; failEmail = true; calls = []; const data = await (await statusApi.GET(statusRequest(accessKey))).json(); assert.equal(data.paid, true); assert.equal(data.notificationPending, true); assert.equal(calls.length, 1); assert.ok(calls[0].url.includes('resend')); failEmail = false; await statusApi.GET(statusRequest(accessKey)); assert.equal(payment.metadata.jasmine_paid_email, session.id); });
  await check('bad webhook signature is rejected', async () => assert.equal((await webhookApi.POST(new Request('http://localhost:3000/api/webhooks/stripe', { method: 'POST', body: '{}' }))).status, 400));
  await check('signed webhook fulfils even if customer closes browser', async () => { payment.metadata = {}; const event = { type: 'checkout.session.completed', data: { object: session } }; const res = await webhookApi.POST(new Request('http://localhost:3000/api/webhooks/stripe', { method: 'POST', headers: { 'stripe-signature': 'offline-valid' }, body: JSON.stringify(event) })); assert.equal(res.status, 200); assert.equal(payment.metadata.jasmine_paid_email, session.id); });
  console.log(`\n${count} checks passed. No real mail, LINE messages, charges or database used.`);
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => { global.fetch = nativeFetch; });
