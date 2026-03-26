import logging

from woodstock.storage.models.file_storage import FileStorage
from woodstock.trace.models.blob import Blob

logger = logging.getLogger(__name__)


def upload_blob(trace_key: str, blob: Blob, file_storage: FileStorage) -> str:
    tree_path = f"{trace_key}/{blob.name}"
    path = f"tree/{tree_path}"
    logger.info("Uploading blob to %s", path)
    file_storage.put_file(path, blob.content)
    return tree_path
