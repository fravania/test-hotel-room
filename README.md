# Hotel Reservation Admin Dashboard

A hotel reservation administration dashboard built with React, TypeScript, Next.js, shadcn/ui, and Tailwind CSS. This application provides an interface for hotel administrators to manage reservations with CRUD operations.

## Features

- **Dashboard View**: Overview with key metrics and today's arrivals
- **Reservation Management**:
  - View all reservations with filtering and sorting capabilities
  - Create new reservations
  - View detailed reservation information
  - Edit reservation details
  - Cancel reservations
  - Check-in and check-out guests

## Technology Stack

- **Frontend Framework**: React with Next.js
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Fetching**: Fetch API

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- pnpm (v7.0.0 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd hotel-dashboard
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
hotel-dashboard/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── dashboard/            # Dashboard page
│   │   ├── reservations/         # Reservations list and detail pages
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Root page (redirects to dashboard)
│   ├── components/               # React components
│   │   ├── ui/                   # UI components from shadcn
│   │   └── sidebar.tsx           # Navigation sidebar
│   └── lib/                      # Utility functions and types
│       ├── api.ts                # API service
│       ├── types.ts              # TypeScript types
│       ├── utils.ts              # Utility functions
│       └── ui-helpers.ts         # UI helper functions
```

## Backend API

The application is designed to work with a RESTful API at the `/frontend_api` endpoint. For detailed API documentation, please refer to the provided API documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This project is a prototype for demonstration purposes. It is not intended for production use as-is without proper security considerations and comprehensive testing.
