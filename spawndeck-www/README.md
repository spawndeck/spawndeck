# Spawndeck Website

Landing pages and marketing site for spawndeck.com

## Development

This package is part of the spawndeck monorepo.

```bash
# From the spawndeck-www directory
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Technology Stack

- **Next.js 15**: React framework with static site generation
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

## Deployment

The website is deployed to AWS using:
- **S3**: Static file hosting
- **CloudFront**: Global CDN with HTTPS
- **Route53**: DNS management
- **ACM**: SSL certificate

### Deploy to Production

```bash
# From the spawndeck-www directory
./deploy.sh
```

This will:
1. Build the Next.js application as static files
2. Deploy the infrastructure using AWS CDK
3. Upload the files to S3
4. Invalidate the CloudFront cache

### Manual Build

```bash
npm run build
```

The static files will be generated in the `out` directory.

## Project Structure

```
spawndeck-www/
├── app/              # Next.js app directory
├── public/           # Static assets
├── infrastructure/   # AWS CDK infrastructure code
└── deploy.sh        # Deployment script
```

## About

Spawndeck is a powerful CLI tool for managing multiple Claude Code instances in parallel using Git worktrees.
