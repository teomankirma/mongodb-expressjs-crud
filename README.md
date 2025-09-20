# MongoDB Express CRUD

A minimal Express + MongoDB application that demonstrates user onboarding, reservation management, and credit card storage workflows. Static HTML pages served from the `public` directory interact with REST endpoints backed by Mongoose models.

## Features
- User registration and authentication with conflict handling for duplicate usernames
- Password change flow with server-side validation of old/new credentials
- Reservation creation and deletion with basic validation and optional credit card storage
- Saved credit card listing with duplicate detection on save
- Ticket type catalog exposed through a REST endpoint for dynamic pricing/options
- Static dashboard and form pages served directly from Express

## Tech Stack
- Node.js with Express for routing and middleware
- MongoDB Atlas (or any MongoDB instance) accessed via Mongoose ODM
- Nodemon for local hot-reload during development
- Vanilla HTML/CSS front-end served from `/public`

## Prerequisites
- Node.js 18 or newer
- npm (bundled with Node.js)
- MongoDB connection string (Atlas or self-hosted)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and provide your MongoDB URI:
   ```bash
   cp .env.example .env
   # edit .env and set MONGODB_URI
   ```
3. Start the development server with hot reload:
   ```bash
   npm run dev
   ```
   The app listens on `http://localhost:3000`.
4. For a production-style run without nodemon, use:
   ```bash
   npm run serve
   ```

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | Full MongoDB connection string including credentials and default database. |

## Project Structure
```
.
├── index.js              # Express app entry point and Mongoose connection
├── controllers/          # Route handlers encapsulating business logic
├── routes/               # Express routers grouped by feature
├── models/               # Mongoose schemas and models
├── public/               # Static HTML assets served by Express
├── .env.example          # Template for required environment variables
├── package.json          # npm scripts and dependencies
└── README.md             # Project documentation
```

## API Reference
| Method | Endpoint | Purpose | Controller |
|--------|----------|---------|------------|
| GET | `/signup` | Serve signup page | `signup.controller#getSignupPage` |
| POST | `/signup` | Create a new user | `signup.controller#postSignup` |
| GET | `/signin` | Serve signin page | `signin.controller#getSigninPage` |
| POST | `/signin` | Authenticate a user | `signin.controller#postSignin` |
| GET | `/dashboard` | Serve dashboard page | `dashboard.controller#getDashboardPage` |
| GET | `/change-password` | Serve change password page | `change-password.controller#getChangePasswordPage` |
| POST | `/change-password` | Update user password | `change-password.controller#updatePassword` |
| GET | `/new-reservation` | Serve reservation form | `new-reservation.controller#getNewReservationPage` |
| POST | `/new-reservation` | Add reservation (+optional card storage) | `new-reservation.controller#addReservation` |
| DELETE | `/delete-reservation/:reservationId` | Remove reservation by ID | `delete-reservation.controller#deleteReservation` |
| GET | `/ticket-types` | List ticket types | `ticket-type.controller#getTicketTypes` |
| GET | `/saved-credit-cards/:userId` | List saved cards for a user | `saved-credit-cards.controller#getSavedCards` |

## Data Models
- **User** (`models/user.model.js`)
  - `username` (unique, required)
  - `password` (stored in plaintext for demo purposes — replace with hashing before production)
  - `reservations[]` with `ticketType`, `date`, `people`, `price`
  - `savedCreditCards[]` with `cardName`, `cardNumber`, `expiryMonth`, `expiryYear`, `securityCode`
- **Ticket_Type** (`models/ticket-type.model.js`)
  - `type`, `basePrice`, `description`

## Development Guide
- Run `npm run dev` to enable automatic restarts while editing server code.
- Routes live under `/routes`. To add a new feature, create a controller for business logic and register it through a new router in `index.js`.
- Keep environment-specific secrets in `.env` (already gitignored). Update `.env.example` whenever a new variable is introduced.
- The project currently stores passwords in plaintext for instructional simplicity. For real-world use, integrate hashing (e.g., bcrypt) and session or token-based authentication.
- When working with MongoDB Atlas, ensure your IP is allowlisted and the `MONGODB_URI` includes `retryWrites=true&w=majority` for optimal compatibility.

## Seeding Ticket Types (Optional)
Populate ticket types directly in MongoDB to drive the reservation pricing:
```js
// In a REPL or script after connecting with mongoose
await TicketType.create([
  { type: "Standard", basePrice: 25, description: "General admission" },
  { type: "VIP", basePrice: 60, description: "Reserved seating and perks" },
]);
```

## Troubleshooting
- **Server exits with "Missing MONGODB_URI"**: make sure `.env` exists and the key is set.
- **MongoDB connection fails**: verify credentials, network access, and that your Atlas cluster allows the current IP.
- **Static pages not updating**: browsers may cache aggressively; hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`).

Happy hacking!
