import cron from "node-cron";
import { DatabaseStorage } from "../core/storage";
import { generateArticle, getAIModelName } from "./aiClient";
import { log } from "../index";

const MINIMUM_ARTICLES = 3;
const storage = new DatabaseStorage();

export async function generateNewArticle(): Promise<void> {
  try {
    log("Starting article generation...", "scheduler");
    
    let article = await generateArticle();
    
    // Check for duplicate titles and regenerate if needed
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      // Get all existing articles to check for duplicates
      const existingArticles = await storage.getAllArticles();
      const isDuplicate = existingArticles.some(existingArticle => 
        existingArticle.title.toLowerCase() === article.title.toLowerCase()
      );
      
      if (!isDuplicate) {
        break; // No duplicate found, exit the loop
      }
      
      log(`Duplicate title found: "${article.title}", regenerating...`, "scheduler");
      article = await generateArticle(); // Generate a new article
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      log(`Failed to generate unique title after ${maxAttempts} attempts`, "scheduler");
      throw new Error("Unable to generate article with unique title");
    }
    
    await storage.createArticle({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      tags: article.tags,
      readingTime: article.readingTime,
      aiModel: getAIModelName(),
    });
    
    log(`Article generated: "${article.title}" with tags: ${article.tags.join(", ")}`, "scheduler");
  } catch (error) {
    log(`Failed to generate article: ${error}`, "scheduler");
    throw error;
  }
}

export async function ensureMinimumArticles(): Promise<void> {
  try {
    const count = await storage.getArticleCount();
    log(`Current article count: ${count}`, "scheduler");
    
    if (count < MINIMUM_ARTICLES) {
      const articlesToGenerate = MINIMUM_ARTICLES - count;
      log(`Generating ${articlesToGenerate} initial articles...`, "scheduler");
      
      for (let i = 0; i < articlesToGenerate; i++) {
        await generateNewArticle();
        if (i < articlesToGenerate - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      
      log("Initial articles generated successfully", "scheduler");
    }
  } catch (error) {
    log(`Error ensuring minimum articles: ${error}`, "scheduler");
  }
}

export function startArticleScheduler(): void {
  cron.schedule("0 0 * * *", async () => {
    log("Daily article generation triggered", "scheduler");
    try {
      await generateNewArticle();
    } catch (error) {
      log(`Scheduled article generation failed: ${error}`, "scheduler");
    }
  });
  
  log("Article scheduler started - will generate 1 article daily at midnight", "scheduler");
}

export async function initializeArticleSystem(): Promise<void> {
  await ensureMinimumArticles();
  startArticleScheduler();
}