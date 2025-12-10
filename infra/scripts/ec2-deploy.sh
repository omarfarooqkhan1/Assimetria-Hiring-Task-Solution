#!/bin/bash

# AutoBlog EC2 Deployment Script
# This script pulls images from ECR and runs them using docker-compose

set -e

APP_DIR="/opt/autoblog"
cd $APP_DIR

echo "========================================="
echo "AutoBlog EC2 Deployment"
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
export ECR_BACKEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-backend"
export ECR_FRONTEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-frontend"

echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "Pulling latest images from ECR..."
docker pull $ECR_BACKEND:latest
docker pull $ECR_FRONTEND:latest

echo "Stopping existing containers..."
docker-compose down || true

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
echo "API endpoint:"
echo "  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_PUBLIC_IP'):5000/api"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f        # View logs"
echo "  docker-compose ps             # Check status"
echo "  docker-compose restart        # Restart services"
echo ""