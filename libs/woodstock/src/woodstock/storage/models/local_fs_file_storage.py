import os
import typing as T
from pathlib import Path

import woodstock.settings as settings
from woodstock.storage.models.file_storage import FileStorage


class LocalFsFileStorage(FileStorage):
    def __init__(self, base_path: T.Optional[Path] = None):
        self.base_path = (
            Path(base_path) if base_path else settings.WOODSTOCK_LOCAL_STORAGE_DIR
        )
        self.base_path.mkdir(parents=True, exist_ok=True)

    def put_file(self, path: str, content: bytes) -> None:
        full_path = self.base_path / path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_bytes(content)

    def get_file(self, path: str) -> bytes:
        return (self.base_path / path).read_bytes()

    def list_files(self, prefix: str, start_after: str = "") -> T.List[str]:
        prefix_dir = self.base_path / prefix
        if not prefix_dir.exists():
            return []

        # Collect all files under prefix, sorted lexicographically by relative path
        entries = []
        for dirpath, _dirnames, filenames in os.walk(prefix_dir):
            for filename in filenames:
                abs_path = Path(dirpath) / filename
                rel_path = abs_path.relative_to(self.base_path).as_posix()
                entries.append(rel_path)
        entries.sort()

        if start_after:
            entries = [e for e in entries if e > start_after]

        return entries

    def delete_files(self, paths: T.List[str]) -> None:
        for path in paths:
            full_path = self.base_path / path
            if full_path.exists():
                full_path.unlink()
