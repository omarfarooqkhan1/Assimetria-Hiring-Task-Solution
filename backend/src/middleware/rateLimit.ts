import rateLimit from "express-rate-limit";
import { log } from "../index";

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    log(`Rate limit exceeded: ${req.ip} on ${req.path}`, "security");
    res.status(429).json(options.message);
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    log(`Auth rate limit exceeded: ${req.ip}`, "security");
    res.status(429).json(options.message);
  },
});

export const generateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Article generation limit reached, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    log(`Generate rate limit exceeded: ${req.ip}`, "security");
    res.status(429).json(options.message);
  },
});
