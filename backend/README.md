# AutoBlog Backend

Express.js backend for the AutoBlog automated article generation platform.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: HuggingFace Inference API
- **Scheduler**: node-cron for daily article generation
- **Security**: Session-based auth, rate limiting, bcrypt

## Directory Structure

```
src/
├── index.ts           # Application entry point
├── db.ts              # Database connection
├── auth.ts            # Session authentication
├── storage.ts         # Data access layer
├── routes/
│   └── index.ts       # API route definitions
├── services/
│   ├── aiClient.ts    # HuggingFace AI client
│   └── articleJob.ts  # Scheduled article generation
├── middleware/
│   └── rateLimit.ts   # Rate limiting middleware
└── models/
    └── index.ts       # Drizzle schema definitions
```

## API Endpoints

### Public
- `GET /api/articles` - List articles (supports ?search, ?category, ?tag)
- `GET /api/articles/:id` - Get single article
- `GET /api/categories` - List all categories
- `GET /api/tags` - List all tags
- `GET /api/health` - Health check with system metrics

### Admin (Protected)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/setup` - One-time admin setup
- `GET /api/auth/user` - Get current user
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/generate` - Generate new article

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `HUGGINGFACE_API_KEY` | HuggingFace API key | No |
| `PORT` | Server port (default: 5000) | No |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Push database schema
npm run db:push

# Build for production
npm run build

# Start production server
npm start
```

## Docker

```bash
# Build image
docker build -t autoblog-backend .

# Run container
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://... \
  -e SESSION_SECRET=your-secret \
  autoblog-backend
```

## Article Generation

The system automatically generates articles using:

1. **HuggingFace Inference API** - Primary AI generation method
2. **Fallback Templates** - High-quality templates used if API fails

Articles are generated:
- On startup (minimum 3 articles)
- Daily at midnight (via node-cron scheduler)
- On-demand via API endpoint
