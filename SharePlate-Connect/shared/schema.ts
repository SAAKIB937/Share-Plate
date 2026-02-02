import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

// Export auth models so they are included in migrations
export * from "./models/auth";

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  donorId: text("donor_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  status: text("status", { enum: ["available", "reserved", "completed"] }).default("available").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  requesterId: text("requester_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "approved", "rejected", "completed"] }).default("pending").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const listingsRelations = relations(listings, ({ one, many }) => ({
  donor: one(users, {
    fields: [listings.donorId],
    references: [users.id],
  }),
  requests: many(requests),
}));

export const requestsRelations = relations(requests, ({ one }) => ({
  listing: one(listings, {
    fields: [requests.listingId],
    references: [listings.id],
  }),
  requester: one(users, {
    fields: [requests.requesterId],
    references: [users.id],
  }),
}));

// Schemas
export const insertListingSchema = createInsertSchema(listings).omit({ 
  id: true, 
  donorId: true, 
  createdAt: true,
  status: true 
});

export const insertRequestSchema = createInsertSchema(requests).omit({ 
  id: true, 
  listingId: true, 
  requesterId: true, 
  createdAt: true,
  status: true 
});

// Types
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

// API Types
export type CreateListingRequest = InsertListing;
export type CreateRequestRequest = InsertRequest;
export type UpdateRequestStatus = { status: "approved" | "rejected" | "completed" };
