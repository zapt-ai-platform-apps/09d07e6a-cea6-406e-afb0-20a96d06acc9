import { pgTable, serial, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const audits = pgTable('audits', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  housingType: text('housing_type').notNull(),
  houseSize: integer('house_size').notNull(), // in square feet
  insulationType: text('insulation_type'),
  heatingSystem: text('heating_system'),
  coolingSystem: text('cooling_system'),
  applianceData: jsonb('appliance_data'), // JSON data for various appliances
  currentEnergyBill: integer('current_energy_bill'), // monthly bill in dollars
  energyScore: integer('energy_score'), // calculated energy efficiency score
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  auditId: integer('audit_id').notNull().references(() => audits.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  potentialSavingsDollars: integer('potential_savings_dollars'),
  potentialSavingsKwh: integer('potential_savings_kwh'),
  implementationCost: integer('implementation_cost'), // estimated cost to implement
  paybackPeriod: integer('payback_period'), // in months
  priority: integer('priority'), // 1-5 priority level
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  recommendationId: integer('recommendation_id').notNull().references(() => recommendations.id),
  implementationDate: timestamp('implementation_date'),
  notes: text('notes'),
  actualSavingsDollars: integer('actual_savings_dollars'),
  actualSavingsKwh: integer('actual_savings_kwh'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});