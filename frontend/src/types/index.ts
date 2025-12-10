// Export types from shared schema
export type { Article, InsertArticle, User, InsertUser } from "../../../shared/schema";

// Define additional frontend-specific types
export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}