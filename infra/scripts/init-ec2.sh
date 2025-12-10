#!/bin/bash

set -e

echo "========================================="
echo "AutoBlog EC2 Initialization Script"
echo "========================================="

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo amazon-linux-extras install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI (if not present)
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Install unzip if not present (needed for AWS CLI installation)
if ! command -v unzip &> /dev/null; then
    echo "Installing unzip..."
    sudo yum install -y unzip
fi

# Create app directory
echo "Creating application directory..."
sudo mkdir -p /opt/autoblog
sudo chown ec2-user:ec2-user /opt/autoblog

# Create environment file template
cat > /opt/autoblog/.env.template << 'EOF'
# PostgreSQL Configuration
POSTGRES_USER=autoblog
POSTGRES_PASSWORD=CHANGE_ME_SECURE_PASSWORD
POSTGRES_DB=autoblog

# Optional: HuggingFace API Key (improves article generation)
HUGGINGFACE_API_KEY=

# AWS Configuration (for ECR access)
AWS_DEFAULT_REGION=us-east-1
AWS_ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID
EOF

echo ""
echo "========================================="
echo "EC2 Initialization Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Copy .env.template to .env and update values"
echo "2. Run the deploy.sh script to pull and start containers"
echo ""
echo "Commands:"
echo "  cd /opt/autoblog"
echo "  cp .env.template .env"
echo "  nano .env  # Edit environment variables"
echo "  ./deploy.sh"
echo ""