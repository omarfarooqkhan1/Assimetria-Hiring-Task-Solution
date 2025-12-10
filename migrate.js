import { Client } from 'pg';

async function main() {
  // Use the forwarded port
  const client = new Client({
    connectionString: 'postgresql://autoblog:postgres@localhost:5433/autoblog',
  });
  
  await client.connect();
  
  // Create users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  // Create articles table
  await client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      reading_time INTEGER NOT NULL,
      ai_model TEXT NOT NULL DEFAULT 'HuggingFace',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  console.log('Migration completed successfully');
  await client.end();
}

main().catch(console.error);