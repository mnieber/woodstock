from enum import Enum


class FileStorageType(str, Enum):
    S3 = "s3"
    LOCAL = "local"
