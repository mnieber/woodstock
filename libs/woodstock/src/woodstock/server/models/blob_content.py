from dataclassy import dataclass


@dataclass
class BlobContent:
    path: str
    content: bytes
