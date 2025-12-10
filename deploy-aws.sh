#!/bin/bash

# AutoBlog AWS Deployment Script
# Run this script from the project root directory

set -e

echo "========================================="
echo "AutoBlog AWS Deployment"
echo "========================================="

# Check prerequisites
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI not found. Please install AWS CLI and configure it."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "Error: Docker not found. Please install Docker."
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    echo "Error: Please run this script from the project root directory."
    exit 1
fi

# Prompt for AWS configuration
read -p "Enter your AWS Account ID: " AWS_ACCOUNT_ID
read -p "Enter your AWS Region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

# Set variables
ECR_BACKEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-backend"
ECR_FRONTEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-frontend"

echo "Configuring AWS CLI..."
export AWS_DEFAULT_REGION=$AWS_REGION

# Log in to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repositories if they don't exist
echo "Creating ECR repositories..."
aws ecr create-repository --repository-name autoblog-backend --region $AWS_REGION || true
aws ecr create-repository --repository-name autoblog-frontend --region $AWS_REGION || true

# Build and push backend image
echo "Building and pushing backend image..."
cd backend
docker build -t autoblog-backend:latest .
docker tag autoblog-backend:latest $ECR_BACKEND:latest
docker push $ECR_BACKEND:latest
cd ..

# Build and push frontend image
echo "Building and pushing frontend image..."
cd frontend
docker build -t autoblog-frontend:latest .
docker tag autoblog-frontend:latest $ECR_FRONTEND:latest
docker push $ECR_FRONTEND:latest
cd ..

echo ""
echo "========================================="
echo "Docker images pushed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Launch an EC2 instance with Amazon Linux 2"
echo "2. Configure security groups to allow ports 22, 80, and 5000"
echo "3. SSH into your EC2 instance and run:"
echo "   curl -O https://raw.githubusercontent.com/your-repo/main/infra/scripts/init-ec2.sh"
echo "   chmod +x init-ec2.sh"
echo "   ./init-ec2.sh"
echo ""
echo "4. After initialization, configure your environment variables in /opt/autoblog/.env"
echo "5. Run the deployment script on EC2:"
echo "   cd /opt/autoblog && ./deploy.sh"
echo ""