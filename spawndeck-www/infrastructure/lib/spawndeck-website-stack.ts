import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class SpawndeckWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = 'spawndeck.com';
    const wwwDomainName = `www.${domainName}`;

    // Look up the existing hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: domainName,
    });

    // Create ACM certificate for both domain and www subdomain
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: domainName,
      subjectAlternativeNames: [
        wwwDomainName,
        `*.${domainName}`,
      ],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Create S3 bucket for website hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `${domainName}-website`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Create CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${domainName}`,
    });

    // Grant read permissions to CloudFront
    websiteBucket.grantRead(originAccessIdentity);

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      certificate: certificate,
      domainNames: [domainName, wwwDomainName],
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(websiteBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      comment: `CloudFront distribution for ${domainName}`,
    });

    // Create Route53 A records for both apex and www
    new route53.ARecord(this, 'ARecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: domainName,
    });

    new route53.ARecord(this, 'WwwARecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: wwwDomainName,
    });

    // Create AAAA records for IPv6
    new route53.AaaaRecord(this, 'AaaaRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: domainName,
    });

    new route53.AaaaRecord(this, 'WwwAaaaRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: wwwDomainName,
    });

    // Deploy website content from out directory
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./out')],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${domainName}`,
      description: 'Website URL',
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name',
    });
  }
}