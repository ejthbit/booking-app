# Booking App

Booking API for private services.
Handles appointments, employee service schedules, user authentication with roles, announcements, and workplace configuration.

## Tech Stack

-   **Runtime:** Node.js with Babel (`@babel/preset-env`, ES module imports)
-   **Framework:** Express
-   **Database:** PostgreSQL with Prisma ORM (v5)
-   **Auth:** JWT (Bearer tokens) with role-based access control (`admin` / `user`)
-   **Email:** Nodemailer (booking confirmations, update/delete notifications, contact form)
-   **Docs:** Swagger UI at `/api-docs`

## Getting Started

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Push Prisma schema to database
npx prisma db push

# Regenerate Prisma client
npm run generate

# Start dev server (nodemon + babel-node)
npm run dev
```

The server starts on `http://localhost:${PORT}` (default 5000). Swagger docs available at `/api-docs`.

## Environment Variables

See `.env.example` for all required variables:

| Variable             | Description                                 |
| -------------------- | ------------------------------------------- |
| `PORT`               | Server port (default 5000)                  |
| `NODE_ENV`           | `dev` or `production`                       |
| `DATABASE_URL`       | PostgreSQL connection string                |
| `JWT_SECRET_KEY`     | Secret for signing JWT tokens               |
| `ORIGIN`             | Production CORS origin(s), comma-separated  |
| `ORIGIN_DEV`         | Development CORS origin(s), comma-separated |
| `CORS_EXTRA_ORIGINS` | Additional CORS origins, comma-separated    |
| `SMTP_SERVER`        | SMTP server hostname                        |
| `EMAIL`              | Sender email address                        |
| `MAILER_PASS`        | SMTP password                               |

## API Endpoints

### Bookings (`/bookings`)

| Method | Path                                                                        | Auth | Description                              |
| ------ | --------------------------------------------------------------------------- | ---- | ---------------------------------------- |
| POST   | `/booking`                                                                  | No   | Create a new booking                     |
| GET    | `/getBookings/:from/:to/:workplace`                                         | JWT  | Get bookings by date range and workplace |
| GET    | `/getAvailableSlots/:beginningOfDay/:endOfDay/:timeSlotDuration/:workplace` | No   | Get available time slots                 |
| GET    | `/getDoctorServicesForMonth/:month/:workplace?`                             | No   | Get doctor services for a month          |
| GET    | `/getDoctorServicesByRange/:start/:end/:workplace`                          | No   | Get doctor services for a date range     |
| PUT    | `/booking/:id`                                                              | JWT  | Update a booking                         |
| DELETE | `/booking/:id`                                                              | JWT  | Delete a booking                         |

### Configuration (`/configuration`)

| Method | Path                                       | Auth | Description                                   |
| ------ | ------------------------------------------ | ---- | --------------------------------------------- |
| GET    | `/getAmbulances`                           | No   | Get all workplaces                            |
| GET    | `/getDoctors/:workplaceId`                 | No   | Get doctors for a workplace                   |
| GET    | `/getBookingCategories/:selectedDoctorId?` | No   | Get categories, optionally filtered by doctor |
| GET    | `/getAnnouncements`                        | No   | Get all announcements                         |
| POST   | `/contactForm/sendMessage`                 | No   | Send contact form message                     |

### Administration (`/administration`)

| Method | Path                               | Auth        | Description                      |
| ------ | ---------------------------------- | ----------- | -------------------------------- |
| POST   | `/signIn`                          | No          | Sign in (rate limited)           |
| POST   | `/signUp`                          | JWT         | Register new user (rate limited) |
| POST   | `/doctorService`                   | JWT         | Create doctor service            |
| PUT    | `/doctorService/:month/:workplace` | JWT         | Update doctor service            |
| DELETE | `/doctorService/:id`               | JWT         | Delete doctor service            |
| POST   | `/announcements/announcement`      | JWT         | Create announcement              |
| PUT    | `/announcements/announcement`      | JWT         | Update announcement              |
| DELETE | `/announcements/announcement/:id`  | JWT         | Delete announcement              |
| PUT    | `/user/:id`                        | JWT         | Update user (self or admin)      |
| DELETE | `/user/:id`                        | JWT + Admin | Delete user                      |

## Roles

-   **`user`** (default) — can update own profile data
-   **`admin`** — can update/delete any user, change user roles

## Security

-   Helmet for HTTP headers
-   CORS whitelist with lazy evaluation (env-configurable)
-   Rate limiting on auth endpoints (20 req / 15 min)
-   Atomic booking creation via Prisma `$transaction` (prevents double-booking)
-   Password hashes excluded from all API responses
-   Error handler does not leak stack traces
-   Input validation via `express-validator`
-   `x-powered-by` header disabled

## Project Structure

```
src/
├── controllers/         # Request handlers
├── helpers/             # Mailer setup
├── middlewares/         # Auth, CORS, validation, error handling, admin check
├── routes/              # Express routers with Swagger JSDoc
├── services/            # Business logic (bookings, configuration)
├── utils/               # Slot calculation, email templates, helpers
├── validationSchemas/   # express-validator schemas
├── prismaClient.js      # Shared PrismaClient singleton
├── swagger.js           # Swagger/OpenAPI setup
└── server.js            # App entry point
prisma/
└── schema.prisma        # Database schema
```
