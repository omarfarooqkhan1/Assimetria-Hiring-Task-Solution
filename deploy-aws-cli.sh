#!/bin/bash

# AutoBlog AWS CLI Deployment Script

set -e

echo "========================================="
echo "AutoBlog AWS CLI Deployment"
echo "========================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Prompt for AWS configuration
read -p "Enter your AWS Account ID: " AWS_ACCOUNT_ID
read -p "Enter your AWS Region (default: eu-central-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-eu-central-1}

# Prompt for application configuration
read -p "Enter database password (minimum 8 characters): " POSTGRES_PASSWORD
read -p "Enter session secret (random string for security): " SESSION_SECRET
read -p "Enter your Hugging Face API key (optional, press Enter to skip): " HUGGINGFACE_API_KEY

# Validate inputs
if [[ ${#POSTGRES_PASSWORD} -lt 8 ]]; then
    echo "Error: Database password must be at least 8 characters long."
    exit 1
fi

if [[ -z "$SESSION_SECRET" ]]; then
    echo "Error: Session secret is required."
    exit 1
fi

# Set variables
ECR_BACKEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-backend"
ECR_FRONTEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog-frontend"

# Configure AWS CLI
export AWS_DEFAULT_REGION=$AWS_REGION

echo "Verifying ECR repositories exist..."
if ! aws ecr describe-repositories --repository-names autoblog-backend >/dev/null 2>&1; then
    echo "Error: Repository 'autoblog-backend' not found. Please create it first."
    exit 1
fi

if ! aws ecr describe-repositories --repository-names autoblog-frontend >/dev/null 2>&1; then
    echo "Error: Repository 'autoblog-frontend' not found. Please create it first."
    exit 1
fi

# Test Docker build for both frontend and backend locally first
echo "Testing local Docker builds..."
cd backend
echo "Building backend Docker image locally..."
docker build -t autoblog-backend:local-test .
cd ..

cd frontend
echo "Building frontend Docker image locally..."
docker build -t autoblog-frontend:local-test .
cd ..

echo "Local Docker builds successful!"

# Login to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

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
echo "To deploy on EC2, create an environment file with the following content:"
echo "====================================================================="
echo "POSTGRES_USER=autoblog"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo "POSTGRES_DB=autoblog"
echo "SESSION_SECRET=$SESSION_SECRET"
if [[ -n "$HUGGINGFACE_API_KEY" ]]; then
    echo "HUGGINGFACE_API_KEY=$HUGGINGFACE_API_KEY"
else
    echo "# HUGGINGFACE_API_KEY=your_huggingface_api_key # Optional"
fi
echo "AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID"
echo "AWS_DEFAULT_REGION=$AWS_REGION"
echo "ECR_BACKEND=$ECR_BACKEND"
echo "ECR_FRONTEND=$ECR_FRONTEND"
echo "====================================================================="
echo ""
echo "Then follow these deployment steps on your EC2 instance:"
echo "1. Launch an EC2 instance with Amazon Linux 2"
echo "2. SSH into your instance"
echo "3. Run the following commands:"
echo ""
echo "   # Update system"
echo "   sudo yum update -y"
echo ""
echo "   # Install Docker"
echo "   sudo amazon-linux-extras install docker -y"
echo "   sudo systemctl start docker"
echo "   sudo systemctl enable docker"
echo "   sudo usermod -aG docker ec2-user"
echo ""
echo "   # Install Docker Compose"
echo "   sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
echo "   sudo chmod +x /usr/local/bin/docker-compose"
echo ""
echo "   # Create app directory"
echo "   sudo mkdir -p /opt/autoblog"
echo "   sudo chown ec2-user:ec2-user /opt/autoblog"
echo ""
echo "   # Create environment file (copy the content shown above)"
echo "   nano /opt/autoblog/.env  # Paste the environment variables here"
echo ""
echo "   # Download and run deployment script"
echo "   cd /opt/autoblog"
echo "   curl -O https://raw.githubusercontent.com/your-username/your-repo/main/infra/scripts/ec2-deploy.sh"
echo "   chmod +x ec2-deploy.sh"
echo "   ./ec2-deploy.sh"
echo ""