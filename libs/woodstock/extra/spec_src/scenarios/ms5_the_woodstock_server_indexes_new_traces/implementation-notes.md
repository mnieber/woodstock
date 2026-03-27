# Implementation notes

## Minimal server-side state

The woodstock-server persists only one thing: the `last_seen_key` (the UUID v7 key of the last
trace log entry it successfully processed). On startup or poll it lists `traces/` with
`StartAfter={last_seen_key}` and processes everything after it.

## DuckDB index location

The brainstorm places the DuckDB index at `db/index.duckdb` inside the same S3 bucket as the
trace data. Parquet files are mentioned as an alternative. Storing the index on S3 means the
server can be stateless and restarted without losing index state (beyond `last_seen_key`).

## Support --no-loop arg for indexer

The woodstock-indexer entrypoint should be located in woodstock.server.entrypoints.woodstock_indexer.
This entrypoint should be set up (as woodstock-indexer) in pyproject.toml.
The woodstock-indexer command should have a --no-loop arg that allows us to update the index once and then
quit (this will aid in testing).
