import { Router } from "express";
import { healthController } from "../controllers/healthController";

const router = Router();

// Health route
router.get("/", healthController.getHealth.bind(healthController));

export default router;