CREATE TABLE IF NOT EXISTS "actions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users" ("id"),
  "recommendation_id" INTEGER NOT NULL REFERENCES "recommendations" ("id"),
  "implementation_date" TIMESTAMP,
  "notes" TEXT,
  "actual_savings_dollars" INTEGER,
  "actual_savings_kwh" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);