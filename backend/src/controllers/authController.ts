import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { log } from "../index";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await authService.validateUser(username, password);

      if (!user) {
        log(`Failed login attempt for: ${username}`, "auth");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      log(`User logged in: ${username}`, "auth");
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      log(`Login error: ${error}`, "auth");
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId;
    req.session.destroy((err) => {
      if (err) {
        log(`Logout error: ${err}`, "auth");
        return next(err);
      }
      log(`User logged out: ${userId}`, "auth");
      res.json({ message: "Logged out successfully" });
    });
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.json({ user: null });
      }

      const user = await authService.getUserById(userId);
      if (!user) {
        return res.json({ user: null });
      }

      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      log(`Error fetching user: ${error}`, "auth");
      next(error);
    }
  }

  async setupAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const existingUser = await authService.getUserByUsername("admin");
      if (existingUser) {
        return res.status(403).json({ message: "Admin user already exists" });
      }

      const { password } = req.body;
      if (!password || typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const user = await authService.createUser({ username: "admin", password });
      log("Admin user created - setup locked", "auth");
      res.json({ message: "Admin user created successfully", user: { id: user.id, username: user.username } });
    } catch (error) {
      log(`Setup error: ${error}`, "auth");
      next(error);
    }
  }

  async getSetupStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const existingAdmin = await authService.getUserByUsername("admin");
      res.json({ isSetupComplete: !!existingAdmin });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();