from dataclassy import dataclass

from woodstock.server.models.blob_content import BlobContent
from woodstock.storage.models.file_storage import FileStorage


@dataclass
class FetchBlobForm:
    tree_path: str


def fetch_blob(form: FetchBlobForm, file_storage: FileStorage) -> BlobContent:
    content = file_storage.get_file(form.tree_path)
    return BlobContent(path=form.tree_path, content=content)
