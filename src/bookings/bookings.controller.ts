import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CancelBookingDto,
  CreateBookingDto,
  UpdateBookingDto,
  GetAllBookingsQueryDto,
} from './bookings.dto';
import { Booking } from '../types';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getAllBookings(@Query() query: GetAllBookingsQueryDto) {
    return this.bookingsService.getAllBookings(query);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Post()
  createBooking(@Body() createDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createDto);
  }

  @Put(':id')
  updateBooking(@Param('id') id: string, @Body() updateDto: UpdateBookingDto) {
    return this.bookingsService.updateBooking(id, updateDto);
  }

  @Put(':id/cancel')
  cancelBooking(
    @Param('id') id: string,
    @Body() cancelBookingDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, cancelBookingDto);
  }

  @Delete(':id')
  deleteBooking(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }
}
