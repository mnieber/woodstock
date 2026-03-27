import os
from pathlib import Path

from woodstock.storage.enums import FileStorageType

WOODSTOCK_FILE_STORAGE_TYPE: FileStorageType = FileStorageType(
    os.environ.get("WOODSTOCK_FILE_STORAGE_TYPE", FileStorageType.LOCAL)
)
WOODSTOCK_S3_BUCKET: str = os.environ.get("WOODSTOCK_S3_BUCKET", "")
WOODSTOCK_LOCAL_STORAGE_DIR: Path = Path(
    os.environ.get("WOODSTOCK_LOCAL_STORAGE_DIR", "/tmp/woodstock")
)
WOODSTOCK_AWS_REGION: str = os.environ.get("WOODSTOCK_AWS_REGION", "eu-central-1")
WOODSTOCK_POLL_INTERVAL_SECONDS: int = int(os.environ.get("WOODSTOCK_POLL_INTERVAL_SECONDS", "60"))
WOODSTOCK_DB_PATH: str = os.environ.get("WOODSTOCK_DB_PATH", "/tmp/woodstock.db")
