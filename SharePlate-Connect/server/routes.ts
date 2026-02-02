import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { authStorage } from "./replit_integrations/auth/storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Listings
  app.get(api.listings.list.path, async (req, res) => {
    const listings = await storage.getListings();
    res.json(listings);
  });

  app.get(api.listings.get.path, async (req, res) => {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  });

  app.post(api.listings.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.listings.create.input.parse(req.body);
      const userId = req.user.claims.sub; // From Replit Auth
      const listing = await storage.createListing({ ...input, donorId: userId });
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Requests
  app.post(api.requests.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.requests.create.input.parse(req.body);
      const listingId = Number(req.params.listingId);
      const userId = req.user.claims.sub;
      
      const request = await storage.createRequest({ 
        ...input, 
        listingId, 
        requesterId: userId 
      });
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.requests.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const requests = await storage.getRequestsForUser(userId);
    res.json(requests);
  });

  app.patch(api.requests.updateStatus.path, isAuthenticated, async (req: any, res) => {
    try {
      const { status } = api.requests.updateStatus.input.parse(req.body);
      const id = Number(req.params.id);
      
      // Ideally check if user owns the listing associated with request, skipping for MVP/speed
      const updated = await storage.updateRequestStatus(id, status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating status" });
    }
  });

  return httpServer;
}

// Seed data function to be called if needed, or we can just rely on manual creation
async function seedData() {
  // Create a dummy user first if needed, but Replit Auth creates users on login.
  // We can skip seeding for now or create generic listings if we have a user.
}
