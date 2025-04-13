CREATE TABLE IF NOT EXISTS "audits" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users" ("id"),
  "housing_type" TEXT NOT NULL,
  "house_size" INTEGER NOT NULL,
  "insulation_type" TEXT,
  "heating_system" TEXT,
  "cooling_system" TEXT,
  "appliance_data" JSONB,
  "current_energy_bill" INTEGER,
  "energy_score" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);