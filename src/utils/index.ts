import { stat } from 'fs';
import { Booking } from '../types';
import { BookingStatus } from 'src/enums';

export function sortBookings(
  bookings: Booking[],
  sortBy: string,
  order: 'asc' | 'desc' = 'asc',
): Booking[] {
  return [...bookings].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    // Handle null values (for cancelledDate)
    if (valueA === null && valueB === null) return 0;
    if (valueA === null) return order === 'asc' ? 1 : -1;
    if (valueB === null) return order === 'asc' ? -1 : 1;

    // Handle string values (dates, IDs, names, status)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const comparison = valueA.localeCompare(valueB);
      return order === 'asc' ? comparison : -comparison;
    }

    // Handle number values (value, refundValue)
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      const comparison = valueA - valueB;
      return order === 'asc' ? comparison : -comparison;
    }

    // Fallback: convert to string and compare
    const stringA = String(valueA);
    const stringB = String(valueB);
    const comparison = stringA.localeCompare(stringB);
    return order === 'asc' ? comparison : -comparison;
  });
}

export function filterBookingsByStatus(
  bookings: Booking[],
  status: string,
): Booking[] {
  if (status === 'all' || !status) return bookings;
  if (status === BookingStatus.CANCELLED) {
    return bookings.filter((booking) => booking.status === status);
  } else if (status === BookingStatus.CONFIRMED) {
    return bookings.filter(
      (booking) =>
        booking.status === status && booking.departureDate >= getTodayISO(),
    );
  } else {
    return bookings.filter(
      (booking) =>
        booking.departureDate < getTodayISO() &&
        booking.status !== BookingStatus.CANCELLED,
    );
  }
}

export function filterBookingsByDateRange(
  bookings: Booking[],
  from?: string,
  to?: string,
  dateField: 'bookingDate' | 'arrivalDate' | 'departureDate' = 'bookingDate',
): Booking[] {
  return bookings.filter((booking) => {
    const bookingDate = booking[dateField];

    // Handle null dates (like cancelledDate)
    if (!bookingDate) return false;

    if (from && bookingDate < from) return false;
    if (to && bookingDate > to) return false;

    return true;
  });
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
