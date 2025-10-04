import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookingStatus, BookingSortFields } from 'src/enums';
import {
  CancelBookingDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './bookings.dto';
import { Booking } from '../types';
import { bookings } from 'src/bookingData';
import {
  sortBookings,
  filterBookingsByStatus,
  filterBookingsByDateRange,
} from 'src/utils';

@Injectable()
export class BookingsService {
  constructor() {}

  private todayISO() {
    return new Date().toISOString().split('T')[0];
  }

  async getAllBookings(
    query: {
      status?: BookingStatus;
      from?: string;
      to?: string;
      sortBy?: BookingSortFields;
      order?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{
    data: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    totalRevenue: number;
  }> {
    let result = [...bookings];

    // Filter by status
    if (query.status) {
      result = filterBookingsByStatus(result, query.status);
    }

    // Filter by date range
    if (query.from && query.to) {
      result = filterBookingsByDateRange(
        result,
        query.from,
        query.to,
        'bookingDate',
      );
    }

    // Sort by specified field
    if (query.sortBy) {
      result = sortBookings(result, query.sortBy, query.order);
    }

    // Calculate total revenue from filtered bookings
    const totalRevenue = result.reduce((sum, booking) => {
      return sum + booking.value - booking.refundValue;
    }, 0);

    // Get total count before pagination
    const total = result.length;

    // Apply pagination
    const page = Math.max(1, query.page || 1); // Default page 1, minimum 1
    const limit = Math.max(1, Math.min(100, query.limit || 10)); // Default limit 10, max 100, minimum 1
    const skip = (page - 1) * limit;

    const paginatedResult = result.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: paginatedResult,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      totalRevenue,
    };
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking: Booking = bookings.find((b) => b.bookingId === id);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async createBooking(body: CreateBookingDto): Promise<Booking> {
    if (body.arrivalDate < new Date().toISOString().split('T')[0]) {
      throw new BadRequestException('Arrival date cannot be in the past');
    }
    if (new Date(body.departureDate) < new Date(body.arrivalDate)) {
      throw new BadRequestException(
        'departureDate cannot be before arrivalDate',
      );
    }

    const booking: Booking = {
      bookingId: randomUUID(),
      name: body.name,
      bookingDate: this.todayISO(),
      value: body.value,
      arrivalDate: body.arrivalDate,
      departureDate: body.departureDate,
      cancelledDate: null,
      refundValue: 0,
      status: BookingStatus.CONFIRMED,
    };

    bookings.push(booking);
    for (let i = 0; i < 10000000000; i++) {}
    return booking;
  }

  async updateBooking(id: string, body: UpdateBookingDto): Promise<Booking> {
    const booking: Booking = await this.getBookingById(id);
    if (new Date(body.departureDate) < new Date(body.arrivalDate)) {
      throw new BadRequestException(
        'Departure date cannot be before arrival date',
      );
    }

    Object.assign(booking, body);
    return booking;
  }

  async cancelBooking(id: string, body: CancelBookingDto): Promise<Booking> {
    const booking: Booking = await this.getBookingById(id);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }
    if (body?.refundValue > booking.value) {
      throw new BadRequestException(
        'Refund amount cannot be greater than booking amount',
      );
    }
    Object.assign(booking, {
      status: BookingStatus.CANCELLED,
      cancelledDate: this.todayISO(),
      refundValue: body?.refundValue || 0,
    });
    return booking;
  }

  async deleteBooking(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    // Remove the booking from the array
    const updatedBookings = bookings.filter((b) => b.bookingId !== id);
    bookings.splice(0, bookings.length, ...updatedBookings);
    return `Booking with ID ${id} has been successfully deleted`;
  }
}
