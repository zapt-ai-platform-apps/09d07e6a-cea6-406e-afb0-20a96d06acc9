# EcoTrack - Energy Efficiency Tracker

EcoTrack is a mobile-friendly web application that helps individuals and small businesses assess and improve their energy efficiency.

## Features

- **Energy Audit Form**: Answer questions about your home, appliances, and energy usage
- **Energy Efficiency Score**: Get a personalized score based on your energy audit
- **Custom Recommendations**: Receive tailored suggestions to improve energy efficiency
- **Savings Tracking**: Monitor potential and achieved savings in dollars and kilowatt-hours
- **Progress Dashboard**: Track your implementation of recommendations

## Technologies Used

- React for the frontend
- TailwindCSS for styling
- Drizzle ORM with CockroachDB for database
- Vercel for deployment and serverless functions

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in a `.env` file (see below)
4. Run the development server with `npm run dev`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

- `/src` - Frontend React code
  - `/app` - Application pages and components
  - `/modules` - Feature modules
- `/api` - Backend API endpoints (Vercel functions)
- `/drizzle` - Database schema and migrations
- `/public` - Static assets