import { DatabaseStorage } from "../../core/storage";
import { Article, InsertArticle } from "../../models";
import { SearchParams } from "../../core/storage";

export interface IArticleService {
  getAllArticles(params?: SearchParams): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getArticleCount(): Promise<number>;
  getCategories(): Promise<string[]>;
  getTags(): Promise<string[]>;
}

export class ArticleService implements IArticleService {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  async getAllArticles(params?: SearchParams): Promise<Article[]> {
    return this.storage.getAllArticles(params);
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.storage.getArticleById(id);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    return this.storage.createArticle(article);
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    return this.storage.updateArticle(id, article);
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.storage.deleteArticle(id);
  }

  async getArticleCount(): Promise<number> {
    return this.storage.getArticleCount();
  }

  async getCategories(): Promise<string[]> {
    return this.storage.getCategories();
  }

  async getTags(): Promise<string[]> {
    return this.storage.getTags();
  }
}

// Export singleton instance
export const articleService = new ArticleService(new DatabaseStorage());