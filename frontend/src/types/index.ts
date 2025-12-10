// Shared types between frontend and backend

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
  aiModel: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

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