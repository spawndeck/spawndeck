#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SpawndeckWebsiteStack } from '../lib/spawndeck-website-stack';

const app = new cdk.App();
new SpawndeckWebsiteStack(app, 'SpawndeckWebsiteStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1', // Must be us-east-1 for CloudFront
  },
  description: 'Static website infrastructure for spawndeck.com',
});