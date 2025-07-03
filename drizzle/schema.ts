import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations, Table } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Define a reusable `createdAt` timestamp column with default value set to now
const createdAt = timestamp("createdAt").notNull().defaultNow()

// Define a reusable `updatedAt` timestamp column with automatic update on modification
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()) // automatically updates to current time on update

// Define the "events" table with fields like name, description, and duration
export const EventTable = pgTable(
  "events", // table name in the database
  {
    id: uuid("id").primaryKey().defaultRandom(), // unique ID
    name: text("name").notNull(), // event name
    description: text("description"), // optional description
    durationInMinutes: integer("durationInMinutes").notNull(), // duration of the event
    clerkUserId: text("clerkUserId").notNull(), // ID of the user who created it (from Clerk)
    isActive: boolean("isActive").notNull().default(true), // whether the event is currently active
    createdAt, // timestamp when event was created
    updatedAt, // timestamp when event was last updated
  },
  table => ([
    index("clerkUserIdIndex").on(table.clerkUserId), // index on clerkUserId for faster querying
  ])
)

// Define the "schedules" table, one per user, with timezone and timestamps
export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
})

// Define relationships for the ScheduleTable: a schedule has many availabilities
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable), // one-to-many relationship
}))

// Define a PostgreSQL ENUM for the days of the week
export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

// Define the "scheduleAvailabilities" table, which stores available time slots per day
export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId").notNull().references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  table => ([
    index("scheduleIdIndex").on(table.scheduleId),
  ])
)

// Define the reverse relation: each availability belongs to a schedule
export const ScheduleAvailabilityRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId], //local key
      references: [ScheduleTable.id], // foreign key
    }),
  })
)