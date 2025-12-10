# AutoBlog - Automated Article Generation Platform

An automated blog platform that generates articles. Built with React, Node.js, PostgreSQL, and Docker. Designed for AWS EC2 deployment.

## Features

- Article generation using HuggingFace (free tier)
- Daily automated content creation via cron scheduler
- Modern React frontend with dark/light mode
- Search and filtering with full-text search
- Article tagging system with generated tags
- Secure admin dashboard with session authentication
- API rate limiting for protection
- Health monitoring dashboard
- Database backup and restore scripts
- RESTful API with Express.js
- PostgreSQL database with Drizzle ORM
- Dockerized for easy deployment
- AWS CodeBuild CI/CD pipeline

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL 16 with Drizzle ORM |
| AI | HuggingFace Inference API |
| Security | Session auth, bcrypt, rate limiting |
| Container | Docker, Docker Compose |
| Cloud | AWS EC2, ECR, CodeBuild |

## Project Structure

```
.
├── backend/                # Node.js backend (independent package)
│   ├── src/
│   │   ├── index.ts       # Application entry point
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic (AI, scheduler)
│   │   ├── middleware/    # Express middleware
│   │   └── models/        # Database schemas
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Backend container
├── frontend/              # React frontend (independent package)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # Frontend container
├── infra/                 # Infrastructure configs
│   ├── docker-compose.yml
│   ├── buildspec.yml      # AWS CodeBuild
│   └── scripts/           # Deployment scripts
├── scripts/               # Database backup scripts
└── docs/
   └── ARCHITECTURE.md    # Architecture documentation
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Backend setup**
   ```bash
   cd backend
   npm install
   npm run db:push
   npm run dev
   ```

2. **Frontend setup (in another terminal)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the app**
   - Frontend: http://localhost:5173 (dev) or http://localhost:80 (production)
   - API: http://localhost:5000/api

### Docker Deployment

```bash
cd infra
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Backend API on port 5000
- Frontend (Nginx) on port 80

## AWS Deployment

### Architecture
- **EC2**: One instance hosting dockerized frontend + backend
- **ECR**: Store Docker images for frontend and backend
- **CodeBuild**: Pulls repo, builds Docker images, pushes to ECR

### Deployment Flow
1. Push code to GitHub
2. CodeBuild:
   - Pulls repo
   - Builds Docker images
   - Pushes to ECR
3. EC2:
   - Pulls and runs the latest images
   - App runs on EC2 public IP

### Setup Instructions

1. **Set up AWS Resources**
   - Create ECR repositories: `autoblog-backend` and `autoblog-frontend`
   - Create CodeBuild project using `infra/buildspec.yml`
   - Launch EC2 instance (Amazon Linux 2) with appropriate security groups

2. **Configure CodeBuild Environment Variables**
   - `AWS_ACCOUNT_ID`: Your AWS account ID
   - `AWS_DEFAULT_REGION`: Your preferred region (e.g., us-east-1)

3. **Initialize EC2 Instance**
   ```bash
   # SSH into your EC2 instance
   ssh -i your-key.pem ec2-user@your-ec2-public-ip
   
   # Run initialization script
   curl -O https://raw.githubusercontent.com/your-repo/main/infra/scripts/init-ec2.sh
   chmod +x init-ec2.sh
   ./init-ec2.sh
   ```

4. **Configure Environment Variables on EC2**
   ```bash
   cd /opt/autoblog
   cp .env.template .env
   # Edit .env with your configuration
   nano .env
   ```

5. **Deploy Application on EC2**
   ```bash
   cd /opt/autoblog
   ./infra/scripts/ec2-deploy.sh
   ```

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles (supports ?search, ?category, ?tag) |
| GET | `/api/articles/:id` | Get single article |
| GET | `/api/categories` | List all categories |
| GET | `/api/tags` | List all tags |
| GET | `/api/health` | Health check with system metrics |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with username/password |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/setup` | One-time admin setup |
| GET | `/api/auth/user` | Get current user |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |
| POST | `/api/articles/generate` | Generate new article |

### Example Response

```json
{
  "id": "uuid-here",
  "title": "The Future of AI",
  "summary": "An exploration of AI trends...",
  "content": "Full article content...",
  "category": "Technology",
  "tags": ["AI", "Machine Learning", "Future"],
  "readingTime": 5,
  "aiModel": "HuggingFace",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Article Generation

Articles are generated:
- **On startup**: Minimum 3 articles if database is empty
- **Daily**: One new article at midnight (UTC)
- **On demand**: Via admin dashboard or API endpoint

### AI Models

- **Primary**: HuggingFace Inference API (Microsoft Phi-3)
- **Fallback**: High-quality article templates

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `PORT` | Server port (default: 5000) | No |
| `HUGGINGFACE_API_KEY` | HuggingFace API key | No |

## Database Backup

```bash
# Create backup
./scripts/backup-db.sh

# Restore from backup
./scripts/restore-db.sh backups/blog_backup_TIMESTAMP.sql.gz
```

## AWS Deployment

See detailed instructions in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Quick overview:
1. Create ECR repositories for backend and frontend
2. Set up CodeBuild with `infra/buildspec.yml`
3. Launch EC2 instance and run `infra/scripts/init-ec2.sh`
4. Configure environment and run `deploy.sh`

## Author

Built for the Assimetria Technical Challenge.

## License

MIT License