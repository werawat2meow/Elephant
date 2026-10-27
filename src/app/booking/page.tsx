import { pageMetadata } from '../../lib/site';
import BookingClient from './BookingClient';
import { requestsReady } from '../../lib/booking-tickets';
export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('Request a Phuket Elephant Tour', 'Send your tour request for staff review. After availability and details are confirmed, receive an email with your payment link.', '/booking', true);
export default function BookingPage() { return <BookingClient requestAvailable={requestsReady()} />; }
