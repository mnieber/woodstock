import typing as T

import boto3
import woodstock_sdk.settings as settings
from woodstock_sdk.storage.models.file_storage import FileStorage


class S3FileStorage(FileStorage):
    def __init__(
        self,
        bucket_name: T.Optional[str] = None,
        region_name: T.Optional[str] = None,
    ):
        self.bucket_name = bucket_name or settings.WOODSTOCK_S3_BUCKET
        self.region_name = region_name or settings.WOODSTOCK_AWS_REGION
        self.s3_client = boto3.client("s3", region_name=self.region_name)

    def put_file(self, path: str, content: bytes) -> None:
        self.s3_client.put_object(Bucket=self.bucket_name, Key=path, Body=content)

    def get_file(self, path: str) -> bytes:
        response = self.s3_client.get_object(Bucket=self.bucket_name, Key=path)
        return response["Body"].read()

    def list_files(self, prefix: str, start_after: str = "") -> T.List[str]:
        paginator = self.s3_client.get_paginator("list_objects_v2")
        pages = paginator.paginate(
            Bucket=self.bucket_name,
            Prefix=prefix,
            StartAfter=start_after,
        )
        keys = []
        for page in pages:
            for obj in page.get("Contents", []):
                keys.append(obj["Key"])
        return keys

    def delete_files(self, paths: T.List[str]) -> None:
        if not paths:
            return
        # S3 batch delete supports up to 1000 keys per request
        for i in range(0, len(paths), 1000):
            batch = paths[i : i + 1000]
            self.s3_client.delete_objects(
                Bucket=self.bucket_name,
                Delete={"Objects": [{"Key": p} for p in batch]},
            )
