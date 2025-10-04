import { BookingStatus } from 'src/enums';

export type Booking = {
  bookingId: string;
  name: string;
  bookingDate: string;
  value: number;
  arrivalDate: string;
  departureDate: string;
  cancelledDate: string | null;
  refundValue: number;
  status: BookingStatus;
};
