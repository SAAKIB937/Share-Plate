import { db } from "./db";
import { listings, requests, type Listing, type InsertListing, type Request, type InsertRequest, users } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getListings(): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  createRequest(request: InsertRequest): Promise<Request>;
  getRequestsForUser(userId: string): Promise<(Request & { listing: Listing })[]>;
  getRequestsForListing(listingId: number): Promise<(Request & { requester: typeof users.$inferSelect })[]>;
  updateRequestStatus(id: number, status: "approved" | "rejected" | "completed"): Promise<Request>;
}

export class DatabaseStorage implements IStorage {
  async getListings(): Promise<Listing[]> {
    return await db.select().from(listings).where(eq(listings.status, "available")).orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const [newRequest] = await db.insert(requests).values(request).returning();
    return newRequest;
  }

  async getRequestsForUser(userId: string): Promise<(Request & { listing: Listing })[]> {
    const rows = await db
      .select({
        request: requests,
        listing: listings,
      })
      .from(requests)
      .innerJoin(listings, eq(requests.listingId, listings.id))
      .where(eq(requests.requesterId, userId))
      .orderBy(desc(requests.createdAt));

    return rows.map(row => ({ ...row.request, listing: row.listing }));
  }

  async getRequestsForListing(listingId: number): Promise<(Request & { requester: typeof users.$inferSelect })[]> {
    const rows = await db
      .select({
        request: requests,
        requester: users,
      })
      .from(requests)
      .innerJoin(users, eq(requests.requesterId, users.id))
      .where(eq(requests.listingId, listingId));
    
    return rows.map(row => ({ ...row.request, requester: row.requester }));
  }

  async updateRequestStatus(id: number, status: "approved" | "rejected" | "completed"): Promise<Request> {
    const [updated] = await db
      .update(requests)
      .set({ status })
      .where(eq(requests.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
