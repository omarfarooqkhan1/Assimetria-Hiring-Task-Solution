import { Router } from "express";
import { articleController } from "../controllers/articleController";
import { requireAuth } from "../auth";
import { generateRateLimiter } from "../middleware/rateLimit";

const router = Router();

// Article routes
router.get("/", articleController.getArticles.bind(articleController));
router.get("/:id", articleController.getArticleById.bind(articleController));
router.put("/:id", requireAuth, articleController.updateArticle.bind(articleController));
router.delete("/:id", requireAuth, articleController.deleteArticle.bind(articleController));
router.post("/generate", generateRateLimiter, requireAuth, articleController.generateArticle.bind(articleController));

// Category and tag routes
router.get("/categories", articleController.getCategories.bind(articleController));
router.get("/tags", articleController.getTags.bind(articleController));

export default router;