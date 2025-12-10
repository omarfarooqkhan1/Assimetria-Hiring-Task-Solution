# AutoBlog Architecture Documentation

## Overview

AutoBlog is an automated blog platform that generates articles using HuggingFace's free inference API. The system consists of a React frontend, Node.js backend, and PostgreSQL database, all containerized with Docker for deployment on AWS EC2.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS EC2 Instance                         │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │   Nginx     │    │   Node.js   │    │     PostgreSQL      │  │
│  │  (Frontend) │───▶│  (Backend)  │───▶│     (Database)      │  │
│  │   :80       │    │   :5000     │    │      :5432          │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│        │                  │                                       │
│        │                  │                                       │
│        │                  ▼                                       │
│        │           ┌─────────────┐                               │
│        │           │ HuggingFace │                               │
│        │           │     API     │                               │
│        │           └─────────────┘                               │
└────────┼──────────────────────────────────────────────────────────┘
         │
         ▼
    ┌──────────┐
    │  Users   │
    └──────────┘
```

## Components

### Frontend (React + TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- TanStack Query for data fetching
- Wouter for client-side routing
- Vite for bundling

**Key Features:**
- Server-side rendered (SSR) compatible
- Dark/light mode support
- Responsive design
- SEO optimized

**Directory Structure:**
```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI components (Shadcn)
│   ├── header.tsx       # Site header with navigation
│   ├── footer.tsx       # Site footer
│   ├── article-card.tsx # Article preview card
│   └── theme-provider.tsx
├── pages/
│   ├── home.tsx         # Article list page
│   ├── article.tsx      # Article detail page
│   └── not-found.tsx    # 404 page
├── lib/
│   └── queryClient.ts   # API client configuration
├── api/
│   ├── index.js          # API client entry point
│   ├── articles.js       # Articles API functions
│   ├── auth.js           # Authentication API functions
│   └── health.js         # Health check API functions
└── App.tsx
```

### Backend (Node.js + Express)

**Technology Stack:**
- Express.js with TypeScript
- Drizzle ORM for database operations
- node-cron for scheduling
- HuggingFace Inference API

**Key Features:**
- RESTful API design
- Automatic article generation
- Health check endpoint
- Error handling middleware

**Directory Structure:**
```
backend/src/
├── index.ts             # Application entry point
├── auth.ts              # Authentication setup
├── routes/              # API route definitions
│   ├── index.ts         # Route registration
│   ├── articles.ts      # Article routes
│   ├── auth.ts          # Authentication routes
│   └── health.ts        # Health check routes
├── controllers/         # Request handlers
│   ├── articleController.ts
│   ├── authController.ts
│   └── healthController.ts
├── services/            # Business logic
│   ├── aiClient.ts      # Article generation service
│   ├── articleJob.ts    # Scheduled job handler
│   ├── articleService/  # Article business logic
│   ├── authService/     # Authentication logic
│   └── healthService/   # Health check logic
├── models/              # Data models
│   ├── index.ts         # Model exports
│   ├── articleModel/    # Article schema and types
│   └── userModel/       # User schema and types
├── core/                # Core utilities
│   ├── db.ts            # Database connection
│   └── storage.ts       # Data access layer
└── middleware/          # Express middleware
    ├── errorHandler.ts   # Error handling
    ├── rateLimit.ts     # Rate limiting
    └── validation.ts    # Input validation
```

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/articles | List all articles |
| GET | /api/articles/:id | Get single article |
| POST | /api/articles/generate | Trigger article generation |
| GET | /api/health | Health check |

### Database (PostgreSQL)

**Schema:**
```sql
CREATE TABLE articles (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    reading_time INTEGER NOT NULL,
    ai_model TEXT NOT NULL DEFAULT 'HuggingFace',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Article Generation

### Flow

1. **Trigger** - Either via cron job (daily at midnight) or manual API call
2. **Topic Selection** - Random selection from predefined topic categories
3. **Generation** - Call HuggingFace API with structured prompt
4. **Fallback** - Use high-quality template if API fails
5. **Storage** - Save generated article to PostgreSQL

### Topic Categories
- Technology (AI, cloud, cybersecurity, etc.)
- Science (space, climate, biotech, etc.)
- Innovation (startups, smart cities, etc.)
- Business (fintech, e-commerce, etc.)
- Health (telemedicine, wearables, etc.)

## Deployment Architecture

### AWS Resources

1. **EC2 Instance** (t2.micro or t3.micro for free tier)
   - Runs all Docker containers
   - Public IP for web access

2. **ECR Repositories**
   - `autoblog-backend` - Backend Docker images
   - `autoblog-frontend` - Frontend Docker images

3. **CodeBuild Project**
   - Triggered by GitHub webhook
   - Builds Docker images
   - Pushes to ECR

### Deployment Flow

```
GitHub Push
    │
    ▼
CodeBuild (build images)
    │
    ▼
ECR (store images)
    │
    ▼
EC2 (pull & run)
```

### Docker Containers

| Container | Port | Purpose |
|-----------|------|---------|
| autoblog-frontend | 80 | Nginx serving React app |
| autoblog-backend | 5000 | Express API server |
| autoblog-db | 5432 | PostgreSQL database |

## Security Considerations

1. **Environment Variables**
   - Database credentials stored in .env
   - Never committed to version control

2. **Network Security**
   - Only port 80 exposed publicly
   - Internal Docker network for services
   - PostgreSQL not exposed externally

3. **Application Security**
   - Helmet.js for HTTP headers
   - CORS configured properly
   - Input validation with Zod

## Monitoring & Logging

1. **Health Checks**
   - Backend: `/api/health` endpoint
   - Docker Compose health checks

2. **Logging**
   - Structured logging with timestamps
   - Request/response logging for API calls
   - AI generation status logging

## Scaling Considerations

For future scaling, consider:

1. **Load Balancing** - Add ALB in front of multiple EC2 instances
2. **Database** - Move to RDS for managed PostgreSQL
3. **Caching** - Add Redis for API response caching
4. **CDN** - CloudFront for static asset delivery

## Cost Optimization

The current architecture is optimized for AWS free tier:

- EC2: t2.micro/t3.micro (750 hours/month free)
- ECR: 500MB storage free
- CodeBuild: 100 build minutes/month free
- Data Transfer: 100GB free
