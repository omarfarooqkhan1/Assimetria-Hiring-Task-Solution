# AWS Deployment Guide for AutoBlog

This guide documents the actual deployment process used for the AutoBlog application on AWS.

## Current Deployment Status

The application is currently deployed and running on AWS EC2 at: http://35.157.5.173

Both frontend (port 80) and backend API (port 5000) are accessible.

## Prerequisites

1. AWS Account with appropriate permissions
2. EC2 Key Pair for SSH access
3. Docker installed locally for building images
4. AWS CLI configured with appropriate credentials

## AWS Resource Setup

### 1. Create ECR Repositories

Create two ECR repositories:
- `autoblog-backend`
- `autoblog-frontend`

### 2. Launch EC2 Instance

Launch an EC2 instance with the following specifications:
- Amazon Linux 2023 AMI
- t3.medium instance type (for optimal performance)
- Security group allowing inbound traffic on ports 22, 80, and 5000
- Associate your key pair for SSH access

## Local Build and Push Process

### 1. Build Backend Image

```bash
cd backend
docker build --platform linux/amd64 -t autoblog-backend .
docker tag autoblog-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-backend:latest
```

### 2. Build Frontend Image

```bash
cd frontend
npm run build
docker build --platform linux/amd64 -t autoblog-frontend .
docker tag autoblog-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-frontend:latest
```

### 3. Push Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com

# Push images
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/autoblog-frontend:latest
```

## EC2 Instance Setup

### 1. SSH into EC2 Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

### 2. Install Docker and Docker Compose

```bash
sudo dnf update -y
sudo dnf install docker docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

### 3. Create Application Directory

```bash
sudo mkdir -p /opt/autoblog
sudo chown ec2-user:ec2-user /opt/autoblog
cd /opt/autoblog
```

### 4. Create Environment File

Create a `.env` file with your configuration:

```bash
cat > .env << 'EOF'
POSTGRES_USER=autoblog
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=autoblog
SESSION_SECRET=your_session_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
AWS_ACCOUNT_ID=your_aws_account_id
AWS_DEFAULT_REGION=your_aws_region
ECR_BACKEND=your_account_id.dkr.ecr.your_region.amazonaws.com/autoblog-backend
ECR_FRONTEND=your_account_id.dkr.ecr.your_region.amazonaws.com/autoblog-frontend
EOF
```

### 5. Copy docker-compose.yml

Copy the `infra/docker-compose.yml` file to `/opt/autoblog/docker-compose.yml` on your EC2 instance.

### 6. Deploy Application

```bash
# Login to ECR
aws ecr get-login-password --region your_region | sudo docker login --username AWS --password-stdin your_account_id.dkr.ecr.your_region.amazonaws.com

# Pull and start services
sudo docker-compose pull
sudo docker-compose up -d
```

## Verification

After deployment, verify that all services are running:

```bash
sudo docker-compose ps
```

You should see three containers running:
- autoblog-db (PostgreSQL)
- autoblog-backend (Node.js API)
- autoblog-frontend (Nginx serving React app)

Check the logs to ensure there are no errors:

```bash
sudo docker-compose logs backend
sudo docker-compose logs frontend
sudo docker-compose logs database
```

## Accessing the Application

Once deployed, you can access:
- Frontend: http://YOUR_EC2_PUBLIC_IP
- Backend API: http://YOUR_EC2_PUBLIC_IP:5000

## Troubleshooting

### Common Issues

1. **Permission denied errors with Docker**: Ensure you've added your user to the docker group and logged out/in.

2. **Platform compatibility issues**: Always build images with `--platform linux/amd64` when deploying to EC2.

3. **Database connection issues**: Verify the DATABASE_URL in your environment variables and ensure the database container is running.

4. **HuggingFace API errors**: Check that your API key is correctly configured and that you have access to the model.

### Checking Logs

To diagnose issues, check the container logs:

```bash
sudo docker-compose logs backend
sudo docker-compose logs frontend
sudo docker-compose logs database
```

## Updating the Application

To update the application:

1. Build and push new Docker images from your local machine
2. SSH into the EC2 instance
3. Pull the latest images and restart services:

```bash
cd /opt/autoblog
sudo docker-compose pull
sudo docker-compose down
sudo docker-compose up -d
```