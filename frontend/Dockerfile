# Frontend Dockerfile
# Build from frontend directory: docker build -t autoblog-frontend .

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY src/ ./src/
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY ../shared/ ./shared/

# Build the frontend
RUN npm run build

# Production stage - serve with Nginx
FROM nginx:alpine AS runner

# Copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]