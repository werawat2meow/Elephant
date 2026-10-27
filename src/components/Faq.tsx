export default function Faq() {
  const items = [
    ['Is Jasmine Tour the sanctuary operator?', 'No. Jasmine Tour is presented as a booking agent. The actual tour operator and location must be identified before you agree to a booking.'],
    ['How do I book and pay?', 'Choose a tour and date, enter your details and send a request. Staff receive it through LINE and check availability, the final price and pickup. After review, staff send an email with the agreed details and a Stripe card-payment link. No payment is requested at initial submission.'],
    ['When will I receive an email?', 'After staff check and approve your request, they send the booking details and payment link by email. Once Stripe verifies your payment, the system sends a separate payment-confirmation email. Check your spam folder or contact staff if an expected email is missing.'],
    ['How do I know my payment succeeded?', 'The website checks the checkout session with Stripe before showing a payment-success message. A URL parameter or a LINE message alone is not proof of payment. If verification or the team notification is delayed, check again or contact staff before paying again.'],
    ['Is hotel pickup included?', 'Pickup coverage, meeting point, time and any additional charge are not yet verified. Include your hotel area in an enquiry and wait for written confirmation.'],
    ['Where do I enter my card details?', 'On Stripe’s hosted checkout page when card payments are configured. Card numbers and CVC are not entered into the tour website or sent to LINE.'],
    ['What are the child prices and cancellation conditions?', 'Catalogue prices are provisional. Child age bands, infant charges, cancellation deadlines and refund terms must be supplied with the confirmed operator quote before payment.'],
  ];
  return <section className="my-10"><h2 className="text-2xl font-bold mb-4">Booking FAQ · คำถามเรื่องการจอง</h2>{items.map(([q, a]) => <details key={q} className="border-b py-4"><summary className="font-semibold cursor-pointer">{q}</summary><p className="mt-3 text-gray-700">{a}</p></details>)}</section>;
}
