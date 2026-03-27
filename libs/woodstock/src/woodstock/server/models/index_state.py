import sqlite3

from dataclassy import dataclass


@dataclass
class IndexState:
    conn: sqlite3.Connection
