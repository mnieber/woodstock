#!/usr/bin/env bash
set -euo pipefail

BUCKET=${WOODSTOCK_S3_BUCKET:-woodstock-local}
echo "Creating S3 bucket: $BUCKET"
awslocal s3 mb "s3://$BUCKET" || echo "Bucket $BUCKET already exists"
