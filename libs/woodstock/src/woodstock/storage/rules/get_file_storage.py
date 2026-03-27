import woodstock.settings as settings
from woodstock.storage.enums import FileStorageType
from woodstock.storage.models.file_storage import FileStorage


def get_file_storage() -> FileStorage:
    if settings.WOODSTOCK_FILE_STORAGE_TYPE == FileStorageType.S3:
        if not settings.WOODSTOCK_S3_BUCKET:
            raise ValueError(
                "WOODSTOCK_S3_BUCKET must be set when WOODSTOCK_FILE_STORAGE_TYPE=s3"
            )
        from woodstock.storage.models.s3_file_storage import S3FileStorage
        return S3FileStorage(bucket_name=settings.WOODSTOCK_S3_BUCKET, region_name=settings.WOODSTOCK_AWS_REGION)

    if settings.WOODSTOCK_FILE_STORAGE_TYPE == FileStorageType.LOCAL:
        from woodstock.storage.models.local_fs_file_storage import LocalFsFileStorage
        return LocalFsFileStorage(base_path=settings.WOODSTOCK_LOCAL_STORAGE_DIR)

    raise ValueError(f"Unknown file storage type: {settings.WOODSTOCK_FILE_STORAGE_TYPE!r}")
