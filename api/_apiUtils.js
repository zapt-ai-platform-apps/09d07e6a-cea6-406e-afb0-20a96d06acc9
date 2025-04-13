import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from "@sentry/node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

// Database connection
export function getDbClient() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  const db = drizzle(client);
  return { client, db };
}

// Error handler
export function handleError(error, res) {
  console.error('API Error:', error);
  Sentry.captureException(error);
  return res.status(500).json({ error: 'Internal Server Error' });
}