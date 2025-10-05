# Booking API

A NestJS-based booking management API built with TypeScript.

## Prerequisites

- **Node.js**: Version 21
- **npm**: Node Package Manager (comes with Node.js)

## Setup Instructions

Follow these steps to set up and run the booking API locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Diwakar00/booking-api.git
cd booking-api
```

### 2. Install Dependencies

```bash
npm i
```

### 3. Start the Application

```bash
npm run start
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with file watching
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get a specific booking by ID
- `POST /bookings` - Create a new booking
- `PUT /bookings/:id` - Update a booking
- `PUT /bookings/:id/cancel` - Cancel a booking
- `DELETE /bookings/:id` - Delete a booking

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Class Validator** - Validation decorators
- **Class Transformer** - Object transformation
