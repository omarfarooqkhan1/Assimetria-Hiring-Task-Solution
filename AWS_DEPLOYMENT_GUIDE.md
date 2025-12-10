# AutoBlog AWS Deployment Guide

This guide will walk you through deploying the AutoBlog system to AWS using Docker containers.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Docker installed locally
4. Git installed

## Architecture Overview

The AutoBlog system consists of three main components:
- **Frontend**: React application served by Nginx
- **Backend**: Node.js Express API with TypeScript
- **Database**: PostgreSQL

All components are containerized using Docker and orchestrated with Docker Compose.

## Deployment Steps

### 1. Set up AWS ECR Repositories

1. Log in to the AWS Console
2. Navigate to Elastic Container Registry (ECR)
3. Create two repositories:
   - `autoblog-backend`
   - `autoblog-frontend`

### 2. Configure AWS CLI

Ensure your AWS CLI is configured with credentials that have permissions to:
- Create and manage ECR repositories
- Push images to ECR
- Manage EC2 instances
- Create and manage IAM roles (if needed)

```bash
aws configure
```

### 3. Build and Push Docker Images

Navigate to the project root and run:

```bash
# Set your AWS account ID
export AWS_ACCOUNT_ID="your-aws-account-id"
export AWS_DEFAULT_REGION="us-east-1"

# Log in to ECR
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com

# Build and push backend image
cd backend
docker build -t autoblog-backend:latest .
docker tag autoblog-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/autoblog-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/autoblog-backend:latest
cd ..

# Build and push frontend image
cd frontend
docker build -t autoblog-frontend:latest .
docker tag autoblog-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/autoblog-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/autoblog-frontend:latest
cd ..
```

### 4. Launch EC2 Instance

1. Launch an EC2 instance with Amazon Linux 2 AMI
2. Choose an instance type (t3.medium or larger recommended)
3. Configure security groups to allow:
   - SSH (port 22) from your IP
   - HTTP (port 80) from anywhere (0.0.0.0/0)
   - Custom TCP (port 5000) from anywhere (for API access)
4. Create or use an existing key pair for SSH access

### 5. Initialize EC2 Instance

SSH into your EC2 instance and run the initialization script:

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Download and run the initialization script
curl -O https://raw.githubusercontent.com/your-repo/main/infra/scripts/init-ec2.sh
chmod +x init-ec2.sh
./init-ec2.sh
```

### 6. Configure Environment Variables

Create and configure the environment file:

```bash
cd /opt/autoblog
cp .env.template .env
nano .env
```

Update the following variables:
- `POSTGRES_PASSWORD`: Set a strong password for PostgreSQL
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `HUGGINGFACE_API_KEY`: (Optional) Your HuggingFace API key for AI article generation
- `SESSION_SECRET`: A random string for session encryption

### 7. Deploy the Application

Run the deployment script:

```bash
cd /opt/autoblog
./deploy.sh
```

### 8. Set up Admin User (Optional)

After deployment, you can set up an admin user:

```bash
# Get the public IP of your EC2 instance
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create admin user
curl -X POST http://$EC2_IP/api/auth/setup -H "Content-Type: application/json" -d '{"password": "your-admin-password"}'
```

## Monitoring and Maintenance

### View Logs

```bash
cd /opt/autoblog
docker-compose logs -f
```

### Restart Services

```bash
cd /opt/autoblog
docker-compose restart
```

### Update Application

To update the application with new code:

1. Rebuild and push new Docker images to ECR
2. Run the deployment script again:
   ```bash
   cd /opt/autoblog
   ./deploy.sh
   ```

## Troubleshooting

### Common Issues

1. **Services not starting**: Check logs with `docker-compose logs`
2. **Database connection issues**: Verify PostgreSQL credentials in .env
3. **Permission denied**: Ensure proper IAM permissions for ECR operations

### Health Checks

Check service health:
```bash
curl http://localhost:5000/api/health
```

## Security Considerations

1. Change default passwords in production
2. Use HTTPS in production (consider AWS Certificate Manager + Application Load Balancer)
3. Restrict security group access to only necessary IPs
4. Regularly update Docker images and system packages
5. Use IAM roles instead of access keys when possible

## Scaling Options

For production deployments, consider:
1. Using AWS ECS or EKS for container orchestration
2. Using RDS instead of containerized PostgreSQL
3. Adding a load balancer for high availability
4. Using CloudFront CDN for frontend assets
5. Setting up auto-scaling groups for EC2 instances