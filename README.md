# Jasmine Tour

Next.js 14 / React 18. Original tour pages and booking form; **staff review first, email a payment link second, charge only when the customer pays**. No separate booking database is required.

## Workflow

1. The customer selects a programme, date/time and guest/contact details, reviews the form and submits a request. Programme selection advances directly to the calendar. There is no card-payment step at initial submission.
2. The server sends the request to staff LINE with reference `JR-…` and a private review link. Status: **Pending review**. No payment session is created and no customer email is sent at this point.
3. Staff check availability and discuss arrangements with the customer. Open the LINE review link, log in to the admin area, and enter the actual provider/location, agreed final price, pickup/inclusions/exclusions and cancellation/refund terms.
4. Staff explicitly check the review acknowledgement and click **Confirm and email payment link**. Only this authenticated action creates the Stripe Checkout Session and sends the customer a prepared email. Status: **Awaiting payment**. Staff do not need to write that email manually.
5. The customer opens the emailed link and chooses to pay by card on Stripe. The success-return URL can verify payment even on a different device. A signed Stripe webhook also works when the customer closes the browser.
6. After verification, staff receive a paid notification in LINE and the customer receives a separate payment-confirmation email. Payment status and message delivery are distinct. A failed notification never tells the customer to pay again.

The approved link can also be copied from the admin result for WhatsApp follow-up, if requested. There is no automated WhatsApp sending. Email API acceptance is displayed as accepted for sending, not delivered/read; check the email provider's delivery/bounce logs when necessary.

## No database

- The original booking form retains its draft in the browser tab. No customer booking table or server booking-history JSON file is used.
- Initial staff review details travel in an AES-GCM encrypted, compressed ticket in the LINE link. The ticket expires after seven days and must be opened by an authenticated admin. The token is in a URL fragment so it is not sent as an initial page URL/query to the server. Changing the encryption secret invalidates outstanding tickets.
- New review tickets also preserve the server catalogue price at submission: programme name, adult/child unit prices and the programme estimate. Admin review displays this separately from the staff-approved final charge and pre-fills the final-price field only when no saved staff quote exists. Older tickets have no historical price; their labelled fallback uses the current catalogue and must be compared with the original LINE notification. Additional pickup fees are added to the final quote and explained in arrangements.
- After staff approval, booking details and the final amount are stored with the Stripe Checkout Session. Notification markers are stored on the PaymentIntent. Stripe holds payment history; LINE holds initial enquiries; the email provider holds send records.
- The staff browser retains the last quote/send result for that request, for convenient reloads. This is not shared across staff/devices and is not a live payment status. Check Stripe for the latest status.
- Stripe/Resend idempotency and LINE retry keys handle ordinary retries. Provider idempotency windows are finite (Resend/LINE: 24 hours), not a permanent central booking ledger. Check existing Stripe/payment/email records before reissuing an old link, changing the agreed quote or resending after those windows.

## Configuration

The original `.env.example` has been restored unchanged. Copy it to `.env.local`, preserve existing real credentials, and add the required new options from `config/booking.env.example`. Neither example is loaded automatically; use `.env.local` or the hosting environment. Do not paste secrets into customer pages or commit them.

**Initial requests and staff review:**

```dotenv
SITE_ORIGIN=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_TO_ID=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
BOOKING_TICKET_SECRET=
```

Use the actual public origin reachable by staff. `NEXTAUTH_SECRET` must be strong; the ticket secret must be at least 32 random characters. A sufficiently long `NEXTAUTH_SECRET` can serve as the fallback ticket secret. Admin passwords are configured as bcrypt hashes, not plaintext. No default account/password is enabled. The review link survives the admin-login redirect where browser session storage is available; otherwise log in and reopen the LINE link.

For the initial local admin account, run `npm run admin:setup` in your own terminal. Enter the email and a password twice (password input is hidden). The helper adds only `ADMIN_EMAIL` and an escaped bcrypt `ADMIN_PASSWORD_HASH`, preserves existing service keys, and saves an ignored `.env.local` backup. It refuses to overwrite an existing admin configuration. Restart the dev server after setup. Do not send the password in chat.

**Staff-approved payment links:**

```dotenv
PAYMENTS_ENABLED=false
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Start with Stripe test credentials. Set `PAYMENTS_ENABLED=true` only for a configured, verified environment. Live mode requires HTTPS `SITE_ORIGIN`. Configure `/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, with that endpoint's signing secret. Initial requests can operate without Stripe; approval/payment email requires Stripe and mail configuration. The public `/api/payments/create-checkout` endpoint is blocked so customers cannot bypass staff approval.

**Transactional email (Resend adapter prepared):**

```dotenv
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
```

Configure a sender/domain verified in your Resend account. `EMAIL_REPLY_TO` is optional. No Resend account/domain has been provisioned or verified by these edits. The email adapter uses HTTP, so no new dependency is installed. If the business already uses another email service, replace the adapter in `src/lib/booking-mail.ts` while retaining its acceptance/error and idempotency contract. See [Resend send API](https://resend.com/docs/api-reference/emails/send-email) and [idempotency behaviour](https://resend.com/docs/dashboard/emails/idempotency-keys).

An email failure is reported explicitly; it does not claim delivery. Retrying the same approved quote reuses the same Stripe/email keys within provider windows. The customer recipient comes from the encrypted request, not an arbitrary address supplied to the approval endpoint. A paid-confirmation failure is retried by the Stripe webhook; the already-accepted LINE message is not sent again when its marker exists.

## Before launch

Confirm operator permissions, capacity/availability, prices/age bands, pickup and cancellation/refund rules before approving a payment. Complete business/contact/privacy/retention details in the public pages. Card details are only entered on Stripe. Original visuals, photos, five-language navigation, calendar and guest form remain; `xxx` placeholders and withheld mock reviews still need owner-supplied evidence. Historical Prisma files/dependencies are not used; do not run a migration for this workflow.

The catalogue is in `data/packages.json`; the legacy display pages also retain original data. Keep display data consistent when editing programmes. Public environment values require rebuilding. `SITE_ORIGIN` also controls canonical URLs, sitemap and robots; setting it for local tests can publish local sitemap URLs, so use a private staging environment appropriately. Search Console and optional GA4 still require real account configuration; analytics does not intentionally include booking text or tickets.

## Verification

Run `npm run test:booking`, `npx tsc --noEmit` and `npm run build`. Offline tests mock every Stripe, LINE and email request and cover encrypted tickets, expiry/tampering, auth, staff review, agreed pricing, recipient protection, retries, failures, cross-device verification and final notifications. No actual email, LINE message or card charge is made. Type checking is enabled during build; legacy build lint remains skipped.

Before enabling live use, test real LINE recipients, admin login, verified email sender/delivery/spam/bounces, Stripe test card success/decline/3-D Secure, cancel/back, expired links, retries, browser reloads and webhook recovery on staging. Account setup, DNS sender verification and real delivery tests have not been completed by the code changes. Nothing has been deployed.
