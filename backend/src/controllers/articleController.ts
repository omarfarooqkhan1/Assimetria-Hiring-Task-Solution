import { Request, Response, NextFunction } from "express";
import { insertArticleSchema } from "../models";
import { generateNewArticle } from "../services/articleJob";
import { articleService } from "../services/articleService";
import { log } from "../index";

export class ArticleController {
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, tag } = req.query;
      const articles = await articleService.getAllArticles({
        search: typeof search === "string" ? search : undefined,
        category: typeof category === "string" ? category : undefined,
        tag: typeof tag === "string" ? tag : undefined,
      });
      res.json(articles);
    } catch (error) {
      log(`Error fetching articles: ${error}`, "api");
      next(error);
    }
  }

  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const article = await articleService.getArticleById(id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      log(`Error fetching article: ${error}`, "api");
      next(error);
    }
  }

  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await articleService.updateArticle(id, validatedData);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      log(`Article updated: ${id}`, "admin");
      res.json(article);
    } catch (error) {
      log(`Error updating article: ${error}`, "api");
      next(error);
    }
  }

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await articleService.deleteArticle(id);

      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }

      log(`Article deleted: ${id}`, "admin");
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      log(`Error deleting article: ${error}`, "api");
      next(error);
    }
  }

  async generateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      await generateNewArticle();
      log("Article generated manually", "admin");
      res.json({ message: "Article generated successfully" });
    } catch (error) {
      log(`Error generating article: ${error}`, "api");
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await articleService.getCategories();
      res.json(categories);
    } catch (error) {
      log(`Error fetching categories: ${error}`, "api");
      next(error);
    }
  }

  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await articleService.getTags();
      res.json(tags);
    } catch (error) {
      log(`Error fetching tags: ${error}`, "api");
      next(error);
    }
  }
}

export const articleController = new ArticleController();