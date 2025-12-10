import type { Express } from "express";
import type { Server } from "http";
import { log } from "../index";
import { generalRateLimiter } from "../middleware/rateLimit";
import { errorHandler, notFoundHandler } from "../middleware/errorHandler";
import { DatabaseStorage } from "../core/storage";

// Import route modules
import authRoutes from "./auth";
import articleRoutes from "./articles.js";
import healthRoutes from "./health";

let adminSetupComplete = false;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const storage = new DatabaseStorage();
  const existingAdmin = await storage.getUserByUsername("admin");
  adminSetupComplete = !!existingAdmin;
  if (adminSetupComplete) {
    log("Admin user exists - setup locked", "auth");
  }

  app.use("/api", generalRateLimiter);

  // Mount route modules
  app.use("/api/auth", authRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/health", healthRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return httpServer;
}