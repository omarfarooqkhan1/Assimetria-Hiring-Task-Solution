import dotenv from "dotenv";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

// Safe path resolution with fallback for environments where import.meta.url is undefined
let __filename: string = '';
let __dirname: string = '';

try {
  if (typeof import.meta.url === 'string') {
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  } else {
    // Fallback for environments where import.meta.url is not available
    __dirname = process.cwd();
  }
} catch (error) {
  // Fallback for any errors during path resolution
  __dirname = process.cwd();
}

const app = express();
const httpServer = createServer(app);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

setupAuth(app);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "../public");
    app.use(express.static(staticPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    port, // Simplified to just pass the port
    "0.0.0.0", // Changed from localhost to 0.0.0.0 for Docker
    async () => {
      log(`serving on port ${port}`);
      
      try {
        const { initializeArticleSystem } = await import("./services/articleJob");
        await initializeArticleSystem();
      } catch (error) {
        log(`Failed to initialize article system: ${error}`, "startup");
      }
    },
  );
})();