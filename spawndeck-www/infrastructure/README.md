# Spawndeck Website Infrastructure

This directory contains the AWS CDK infrastructure code for deploying spawndeck.com as a static website.

## Architecture

- **S3**: Stores the static website files
- **CloudFront**: CDN for global distribution with HTTPS
- **Route53**: DNS management for spawndeck.com
- **ACM**: SSL certificate for HTTPS

## Prerequisites

1. AWS CLI configured with `gammainvestments` profile
2. Node.js and npm installed
3. AWS CDK CLI installed (`npm install -g aws-cdk`)

## Deployment

From the spawndeck-www directory, run:

```bash
./deploy.sh
```

This script will:
1. Build the Next.js application
2. Copy the static files to the infrastructure directory
3. Deploy the infrastructure using AWS CDK

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build Next.js
npm run build

# Copy output
cp -r out infrastructure/

# Deploy CDK
cd infrastructure
npm install
npm run deploy
```

## Destroying the Stack

To remove all infrastructure:

```bash
cd infrastructure
npm run destroy
```

⚠️ **Warning**: This will delete all resources including the S3 bucket and its contents.