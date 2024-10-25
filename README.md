# Resume Page Deployment with AWS CodePipeline, CodeBuild, S3, and CloudFront

This project automates the deployment of a HTML resume site using AWS services. The setup includes AWS CodePipeline to trigger builds on changes to the GitHub repository, AWS CodeBuild to generate a new PDF from the HTML resume site, and AWS S3 and CloudFront to deploy and provide high availability for the resume files.

Note: This could have utilized lambda serverless functions for a more cost-effective solution, but it serves to explore and learn from various services.

## Architecture Overview

1. **AWS CodePipeline**:
   - Triggers a pipeline on any changes detected in the GitHub repository.
   - Initiates the build process using AWS CodeBuild.

2. **AWS CodeBuild**:
   - Runs the `buildspec.yml` to build artifacts from the GitHub repo.
   - Generates a new PDF of the HTML resume site by running `node convert.js`.
   - Syncs the contents of the `/assets` folder to the S3 bucket.

3. **AWS S3**:
   - Stores and serves the resume files.
   - The `resume.erictikhonov.com` bucket holds the deployed resume files.

4. **AWS CloudFront**:
   - Provides high availability and CDN capabilities for the resume files hosted in the S3 bucket.

## Prerequisites

- An AWS account with access to S3, CodePipeline, CodeBuild, and CloudFront services.
- A GitHub repository containing your resume site’s source code and a `buildspec.yml` file.

## Setup Instructions

### 1. Setup GitHub Repository
Ensure your GitHub repository contains the following files:
  - `index.html`
  - `styles.css`
  - `scripts.js`
  - `buildspec.yml`
  - Any assets in the `/assets` folder

### 2. Create S3 Bucket
Create an S3 bucket named `resume.erictikhonov.com`.

### 3. Configure AWS CodeBuild
Create a build project in AWS CodeBuild and link it to your GitHub repository.
Ensure the build project uses a service role with the necessary permissions to access your S3 bucket.
Include a `buildspec.yml` file in your repository with the following configuration:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 12
    commands:
      - npm install
  build:
    commands:
      - echo Build started on `date`
      - node convert.js
      - aws s3 sync assets/ s3://resume.erictikhonov.com/ --delete

artifacts:
  files:
    - assets/**/*
```

### 4. Configure AWS CodePipeline
Create a new pipeline in AWS CodePipeline.
Add a source stage linked to your GitHub repository.
Add a build stage linked to your AWS CodeBuild project.
Add a deploy stage to sync your S3 bucket with the built artifacts.

### 5. Setup AWS CloudFront
Create a CloudFront distribution and point it to your S3 bucket (`resume.erictikhonov.com`).
Configure the distribution to serve content from your S3 bucket.

## Permissions
Ensure your CodeBuild service role includes permissions to access the S3 bucket. Here’s an example policy to attach to the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": [
        "arn:aws:logs:us-east-1:ACCOUNT_ID:log-group:/aws/codebuild/resume-page-build",
        "arn:aws:logs:us-east-1:ACCOUNT_ID:log-group:/aws/codebuild/resume-page-build:*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    },
    {
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::codepipeline-us-east-1-*"
      ],
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketAcl",
        "s3:GetBucketLocation"
      ]
    },
    {
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::resume.erictikhonov.com",
        "arn:aws:s3:::resume.erictikhonov.com/*"
      ],
      "Action": [
        "s3:PutObject",
        "s3:GetBucketAcl",
        "s3:GetBucketLocation",
        "s3:ListBucket",
        "s3:GetObject",
        "s3:DeleteObject"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:CreateReportGroup",
        "codebuild:CreateReport",
        "codebuild:UpdateReport",
        "codebuild:BatchPutTestCases",
        "codebuild:BatchPutCodeCoverages"
      ],
      "Resource": [
        "arn:aws:codebuild:us-east-1:ACCOUNT_ID:report-group/resume-page-build-*"
      ]
    }
  ]
}
```
