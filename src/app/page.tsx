import { pageMetadata } from '../lib/site';
import HomeClient from './HomeClient';
export const metadata = pageMetadata('Phuket Elephant Tour Booking Agent', 'Explore Phuket elephant tour options with Jasmine Tour, a booking agent. Request availability and pickup confirmation before booking.', '/');
export default function Home() { return <HomeClient />; }
