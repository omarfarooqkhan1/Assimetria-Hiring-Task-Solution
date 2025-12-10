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
echo "To deploy on EC2:"
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
echo "   # Create environment file"
echo "   cat > /opt/autoblog/.env << 'EOF'"
echo "   POSTGRES_USER=autoblog"
echo "   POSTGRES_PASSWORD=your_secure_password"
echo "   POSTGRES_DB=autoblog"
echo "   SESSION_SECRET=your_session_secret"
echo "   HUGGINGFACE_API_KEY=your_huggingface_api_key"
echo "   AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID"
echo "   AWS_DEFAULT_REGION=$AWS_REGION"
echo "   ECR_BACKEND=$ECR_BACKEND"
echo "   ECR_FRONTEND=$ECR_FRONTEND"
echo "   EOF"
echo ""
echo "   # Download and run deployment script"
echo "   cd /opt/autoblog"
echo "   curl -O https://raw.githubusercontent.com/your-username/your-repo/main/infra/scripts/ec2-deploy.sh"
echo "   chmod +x ec2-deploy.sh"
echo "   ./ec2-deploy.sh"
echo ""