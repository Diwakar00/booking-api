import {
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { last } from 'rxjs';
import { BookingSortFields, BookingStatus } from 'src/enums';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  arrivalDate: string;

  @IsDateString()
  departureDate: string;

  @IsNumber()
  @Min(1)
  value: number;
}

export class UpdateBookingDto {
  @IsString()
  name: string;

  @IsDateString()
  arrivalDate: string;

  @IsDateString()
  departureDate: string;

  @IsNumber()
  @Min(0)
  value: number;
}

export class CancelBookingDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundValue?: number;
}

export class GetAllBookingsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus, {
    message: `Status must be one of: ${Object.values(BookingStatus).join(', ')}`,
  })
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsEnum(BookingSortFields, {
    message: `sortBy must be one of: ${Object.values(BookingSortFields).join(', ')}`,
  })
  sortBy?: BookingSortFields;

  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'Order must be either "asc" or "desc"',
  })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;
}

export class PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class PaginatedBookingsResponseDto {
  data: any[]; // Will be Booking[] but avoiding circular imports
  pagination: PaginationMeta;
}
