import duckdb
from dataclassy import dataclass


@dataclass
class IndexState:
    conn: duckdb.DuckDBPyConnection
