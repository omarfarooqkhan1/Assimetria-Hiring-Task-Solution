import { Request, Response, NextFunction } from "express";
import { healthService } from "../services/healthService";
import { log } from "../index";

export class HealthController {
  async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const healthStatus = await healthService.getHealthStatus();
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();

      res.json({
        status: healthStatus.database ? "healthy" : "degraded",
        timestamp: healthStatus.timestamp,
        version: "1.0.0",
        uptime: Math.floor(uptime),
        database: {
          connected: healthStatus.database,
          latencyMs: healthStatus.databaseLatency,
          articleCount: healthStatus.articleCount,
          userCount: healthStatus.userCount,
        },
        memory: {
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        },
      });
    } catch (error) {
      log(`Health check error: ${error}`, "health");
      next(error);
    }
  }
}

export const healthController = new HealthController();