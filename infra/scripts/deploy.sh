#!/bin/bash

set -e

APP_DIR="/opt/autoblog"
cd $APP_DIR

echo "========================================="
echo "AutoBlog Deployment Script"
echo "========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.template to .env and configure it."
    exit 1
fi

# Source environment variables
source .env

# Check required variables
if [ -z "$AWS_ACCOUNT_ID" ] || [ "$AWS_ACCOUNT_ID" = "YOUR_AWS_ACCOUNT_ID" ]; then
    echo "Error: AWS_ACCOUNT_ID not configured in .env"
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "CHANGE_ME_SECURE_PASSWORD" ]; then
    echo "Error: POSTGRES_PASSWORD not configured in .env"
    exit 1
fi

AWS_REGION=${AWS_DEFAULT_REGION:-us-east-1}
ECR_BACKEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-backend"
ECR_FRONTEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-frontend"

echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "Pulling latest images from ECR..."
docker pull $ECR_BACKEND:latest
docker pull $ECR_FRONTEND:latest

echo "Stopping existing containers..."
docker-compose -f docker-compose.yml down || true

echo "Creating docker-compose.yml with ECR images..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: autoblog-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-autoblog}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - autoblog-network
    restart: unless-stopped

  backend:
    image: ${ECR_BACKEND}:latest
    container_name: autoblog-backend
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-autoblog}
      SESSION_SECRET: ${SESSION_SECRET:-autoblog_session_secret_change_me}
      PORT: 5000
      NODE_ENV: production
      HUGGINGFACE_API_KEY: ${HUGGINGFACE_API_KEY:-}
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - autoblog-network
    restart: unless-stopped

  frontend:
    image: ${ECR_FRONTEND}:latest
    container_name: autoblog-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - autoblog-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  autoblog-network:
    driver: bridge
EOF

echo "Starting containers..."
docker-compose up -d

echo "Waiting for services to be healthy..."
sleep 15

# Check if services are running
echo ""
echo "Checking service status..."
if docker-compose ps | grep -q "Up"; then
    echo "Services are running successfully!"
else
    echo "Warning: Some services may not be running properly."
    docker-compose ps
fi

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Services status:"
docker-compose ps
echo ""
echo "Your application should be accessible at:"
echo "  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_PUBLIC_IP')"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f        # View logs"
echo "  docker-compose ps             # Check status"
echo "  docker-compose restart        # Restart services"
echo ""