import os
from pathlib import Path

# Storage backend selection: set WOODSTOCK_S3_BUCKET for S3, or WOODSTOCK_LOCAL_STORAGE_DIR for local fs
WOODSTOCK_S3_BUCKET: str = os.environ.get("WOODSTOCK_S3_BUCKET", "")
WOODSTOCK_LOCAL_STORAGE_DIR: Path = Path(
    os.environ.get("WOODSTOCK_LOCAL_STORAGE_DIR", "/tmp/woodstock")
)
WOODSTOCK_AWS_REGION: str = os.environ.get("WOODSTOCK_AWS_REGION", "us-east-1")
