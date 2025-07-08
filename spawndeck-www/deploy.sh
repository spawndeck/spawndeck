#!/bin/bash

# Exit on error
set -e

echo "🚀 Building Next.js application..."
NODE_ENV=production npm run build

echo "📦 Moving build output to infrastructure directory..."
rm -rf infrastructure/out
cp -r out infrastructure/

echo "🏗️  Installing CDK dependencies..."
cd infrastructure
npm install

echo "🔧 Bootstrapping CDK (if needed)..."
npx cdk bootstrap --profile gammainvestments

echo "🚀 Deploying to AWS..."
npm run deploy

echo "✅ Deployment complete!"
echo "Visit your website at: https://spawndeck.com"