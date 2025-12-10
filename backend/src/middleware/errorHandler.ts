import { Request, Response, NextFunction } from "express";
import { log } from "../index";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error
  log(`Error ${status}: ${message} - ${req.method} ${req.path}`, "error");

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === "development";
  const responseMessage = status === 500 && !isDevelopment ? "Internal Server Error" : message;

  res.status(status).json({
    message: responseMessage,
    ...(isDevelopment && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ message: "Route not found" });
}