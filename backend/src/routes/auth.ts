import { Router } from "express";
import { authController } from "../controllers/authController";
import { authRateLimiter } from "../middleware/rateLimit";

const router = Router();

// Auth routes
router.post("/login", authRateLimiter, authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/user", authController.getCurrentUser.bind(authController));
router.get("/setup-status", authController.getSetupStatus.bind(authController));
router.post("/setup", authRateLimiter, authController.setupAdmin.bind(authController));

export default router;