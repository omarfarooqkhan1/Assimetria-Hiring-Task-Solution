import { type Article, type InsertArticle, type User, type InsertUser, articles, users } from "../models";import { db } from "./db";
import { desc, eq, ilike, or, and, arrayContains, sql } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export interface SearchParams {
  search?: string;
  category?: string;
  tag?: string;
}

export interface HealthStatus {
  database: boolean;
  databaseLatency: number;
  articleCount: number;
  userCount: number;
  timestamp: string;
}

export interface IStorage {
  getAllArticles(params?: SearchParams): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getArticleCount(): Promise<number>;
  getCategories(): Promise<string[]>;
  getTags(): Promise<string[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHealthStatus(): Promise<HealthStatus>;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split(".");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export class DatabaseStorage implements IStorage {
  async getAllArticles(params?: SearchParams): Promise<Article[]> {
    const conditions = [];
    
    if (params?.search) {
      const searchTerm = `%${params.search}%`;
      conditions.push(
        or(
          ilike(articles.title, searchTerm),
          ilike(articles.content, searchTerm),
          ilike(articles.summary, searchTerm)
        )
      );
    }
    
    if (params?.category && params.category !== "all") {
      conditions.push(eq(articles.category, params.category));
    }
    
    if (params?.tag && params.tag !== "all") {
      conditions.push(arrayContains(articles.tags, [params.tag]));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 
        ? conditions[0]
        : and(...conditions);
      return await db
        .select()
        .from(articles)
        .where(whereClause)
        .orderBy(desc(articles.createdAt));
    }
    
    return await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const result = await db
      .update(articles)
      .set(article)
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning();
    return result.length > 0;
  }

  async getArticleCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(articles);
    return result[0]?.count ?? 0;
  }

  async getCategories(): Promise<string[]> {
    const result = await db
      .selectDistinct({ category: articles.category })
      .from(articles)
      .orderBy(articles.category);
    return result.map(r => r.category);
  }

  async getTags(): Promise<string[]> {
    const result = await db
      .select({ tags: articles.tags })
      .from(articles);
    const allTags = result.flatMap(r => r.tags || []);
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const result = await db
      .insert(users)
      .values({ ...user, password: hashedPassword })
      .returning();
    return result[0];
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await comparePasswords(password, user.password);
    return isValid ? user : null;
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const start = Date.now();
    
    try {
      const articleCount = await this.getArticleCount();
      const userCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(users);
      const userCount = userCountResult[0]?.count ?? 0;
      
      return {
        database: true,
        databaseLatency: Date.now() - start,
        articleCount,
        userCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        database: false,
        databaseLatency: -1,
        articleCount: 0,
        userCount: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const storage = new DatabaseStorage();
