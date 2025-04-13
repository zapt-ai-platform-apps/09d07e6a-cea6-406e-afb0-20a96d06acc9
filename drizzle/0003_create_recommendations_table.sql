CREATE TABLE IF NOT EXISTS "recommendations" (
  "id" SERIAL PRIMARY KEY,
  "audit_id" INTEGER NOT NULL REFERENCES "audits" ("id"),
  "user_id" UUID NOT NULL REFERENCES "users" ("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "potential_savings_dollars" INTEGER,
  "potential_savings_kwh" INTEGER,
  "implementation_cost" INTEGER,
  "payback_period" INTEGER,
  "priority" INTEGER,
  "completed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);