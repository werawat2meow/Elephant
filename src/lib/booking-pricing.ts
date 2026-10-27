import { tours } from './tours';
import type { BookingInput } from './booking-validation';

export type BookingPricing = {
  packageName: string;
  adultUnitTHB: number;
  childUnitTHB: number;
  totalTHB: number;
  capturedAt: number;
};
export type ReviewPricing = BookingPricing & { source: 'booking_snapshot' | 'current_catalog' };

export function captureBookingPricing(booking: BookingInput, now = Date.now()): BookingPricing {
  const tour = tours.find(item => item.id === booking.packageId);
  if (!tour) throw new Error('invalid_package');
  return {
    packageName: tour.name.en,
    adultUnitTHB: tour.price.adult,
    childUnitTHB: tour.price.child,
    totalTHB: tour.price.adult * booking.adults + tour.price.child * booking.children,
    capturedAt: now,
  };
}
export function reviewBookingPricing(ticket: { booking: BookingInput; pricing?: BookingPricing }): ReviewPricing {
  if (ticket.pricing) return { ...ticket.pricing, source: 'booking_snapshot' };
  // Old encrypted tickets did not store prices. Never label today's catalogue
  // calculation as a recovered historical booking price.
  return { ...captureBookingPricing(ticket.booking), source: 'current_catalog' };
}
