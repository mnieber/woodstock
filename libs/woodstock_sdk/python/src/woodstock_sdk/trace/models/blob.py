from dataclassy import dataclass


@dataclass
class Blob:
    name: str
    content: bytes
