import typing as T
from abc import ABC, abstractmethod


class FileStorage(ABC):
    @abstractmethod
    def put_file(self, path: str, content: bytes) -> None: ...

    @abstractmethod
    def get_file(self, path: str) -> bytes: ...

    @abstractmethod
    def list_files(self, prefix: str, start_after: str = "") -> T.List[str]: ...

    @abstractmethod
    def delete_files(self, paths: T.List[str]) -> None: ...
