# AutoBlog Frontend

React frontend for the AutoBlog automated article generation platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Client-side routing
- **TanStack Query** - Data fetching
- **Lucide React** - Icons
- **Vite** - Build tool

## Directory Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── header.tsx       # Site header
│   ├── footer.tsx       # Site footer
│   ├── article-card.tsx # Article card component
│   └── theme-provider.tsx
├── pages/
│   ├── home.tsx         # Article list page
│   ├── article.tsx      # Article detail page
│   ├── admin.tsx        # Admin dashboard
│   └── not-found.tsx    # 404 page
├── lib/
│   ├── queryClient.ts   # TanStack Query client
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── App.tsx              # Main app component
├── main.tsx             # Application entry
└── index.css            # Global styles
```

## Pages

- `/` - Home page with article list, search, and filtering
- `/article/:id` - Article detail page
- `/admin` - Admin dashboard for article management
- `*` - 404 Not Found page

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker

```bash
# Build image
docker build -t autoblog-frontend .

# Run container
docker run -p 80:80 autoblog-frontend
```

## AWS Deployment

The frontend is currently deployed on AWS EC2 at: http://35.157.5.173

### Docker Build for AWS Deployment

When building for AWS deployment, ensure you specify the platform:

```bash
# Build for AWS EC2 (linux/amd64)
npm run build
docker build --platform linux/amd64 -t autoblog-frontend .

# Tag for ECR
docker tag autoblog-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-frontend:latest

# Push to ECR
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-frontend:latest
```

## Features

- Modern, responsive design
- Dark/Light mode support
- Search and filter articles
- Skeleton loading states
- Admin dashboard with authentication
- Health monitoring

## Design System

- **Typography**: Inter (headings/body)
- **Colors**: Blue primary with gradient accents
- **Spacing**: Consistent 8px grid system
- **Components**: Based on Shadcn UI