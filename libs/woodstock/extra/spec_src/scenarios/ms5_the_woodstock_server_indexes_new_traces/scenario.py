import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario("ms5_the_woodstock_server_indexes_new_traces")


def run_scenario():
    Server = c.Woodstock.Server
    Storage = c.Woodstock.Storage

    r.poll_trace_log_action = Server.Actions.PollTraceLog
    r.upsert_trace_action = Server.Actions.UpsertTrace
    r.index_state = Server.Models.IndexState
    r.trace_record = Server.Models.TraceRecord
    r.file_storage = Storage.Models.FileStorage
    r.indexer = Server.Entrypoints.Indexer

    with goal().keep_the(r.duckdb_index).up_to_date_with_the(r.trace_log):
        with the(r.indexer).triggers_the(r.poll_trace_log_action).on_an(r.interval):
            with it().lists_the(r.trace_log).starting_after_the(
                r.last_seen_key
            ).from_the(r.index_state):
                it().reads_the(r.last_seen_key).from_the(r.index_state)
                it().calls_the(r.file_storage).list_files(
                    r.prefix
                ).with_start_after_the(r.last_seen_key).to_get_the(r.new_entries)

            with it().processes_each(r.new_entry).in_the(r.new_entries):
                it().calls_the(r.file_storage).get_file(r.new_entry).to_get_the(
                    r.trace_record
                )
                it().calls_the(r.upsert_trace_action).with_the(r.trace_record)
                it().updates_the(r.last_seen_key).in_the(r.index_state)


markdown_node = sunya.add_markdown_node(
    scenario, "The woodstock-server indexes new traces"
)
markdown_node.markdown = """
The woodstock-server maintains a DuckDB index that it builds incrementally from the append-only
trace log. The indexer triggers a poll at a regular interval; the server fetches only the
entries it has not yet seen and upserts them into the index. All file I/O goes through
`FileStorage`, so the server works identically against S3 or a local directory.

## Steps

### It finds new trace log entries

`PollTraceLog` reads the `last_seen_key` from `IndexState` — the UUID v7 key of the last
trace log entry it processed.</br>
It calls `FileStorage.list_files(prefix="traces/", start_after=last_seen_key)` to retrieve
only newer entries.</br>
Because UUID v7 keys are lexicographically ordered by time, this is always correct — no
coordination or locking is needed.</br>
For `S3FileStorage` this maps to `list_objects` with `StartAfter`; for `LocalFsFileStorage`
it maps to a sorted `os.scandir` with the same cursor logic.</br>

### It upserts each new trace into the DuckDB index

For each new entry, the server calls `FileStorage.get_file(path)` to read the `TraceRecord`
JSON, then calls `UpsertTrace` to insert or update the row in DuckDB (keyed on
`trace_key` + `uuidv7`).</br>
After processing each entry, it advances the `last_seen_key` in `IndexState`.</br>
The DuckDB index is now queryable for filtering by `trace_key`, `trace_state`, `author`,
and `timestamp` — without touching the tree.</br>

## Diagram

```mermaid
sequenceDiagram
    participant Indexer
    participant PollTraceLog as PollTraceLog (action)
    participant IndexState
    participant FileStorage
    participant UpsertTrace as UpsertTrace (action)
    participant DuckDB

    Indexer->>PollTraceLog: trigger()
    PollTraceLog->>IndexState: read last_seen_key
    PollTraceLog->>FileStorage: list_files("traces/", start_after=last_seen_key)
    FileStorage-->>PollTraceLog: new_entries

    loop for each new_entry
        PollTraceLog->>FileStorage: get_file("traces/{uuidv7}.json")
        FileStorage-->>PollTraceLog: TraceRecord
        PollTraceLog->>UpsertTrace: upsert(TraceRecord)
        UpsertTrace->>DuckDB: INSERT OR REPLACE trace row
        PollTraceLog->>IndexState: update last_seen_key = uuidv7
    end
```

### Legend

| Participant | Module path |
|---|---|
| PollTraceLog | `c.Woodstock.Server.Actions.PollTraceLog` |
| UpsertTrace | `c.Woodstock.Server.Actions.UpsertTrace` |
| IndexState | `c.Woodstock.Server.Models.IndexState` |
| FileStorage | `c.Woodstock.Storage.Models.FileStorage` |
"""
