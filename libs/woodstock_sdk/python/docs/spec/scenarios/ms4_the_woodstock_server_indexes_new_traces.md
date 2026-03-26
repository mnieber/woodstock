[comment]: <> (This file is auto-generated. Do not edit directly.)

# Scenario: ms4_the_woodstock_server_indexes_new_traces

## The woodstock-server indexes new traces

The woodstock-server maintains a DuckDB index that it builds incrementally from the append-only
trace log. A scheduler triggers a poll at a regular interval; the server fetches only the
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
The DuckDB index is now queryable for filtering by `trace_key`, `trace_state`, `writer`,
and `timestamp` — without touching the tree.</br>

## Diagram

```mermaid
sequenceDiagram
    participant Scheduler
    participant PollTraceLog as PollTraceLog (action)
    participant IndexState
    participant FileStorage
    participant UpsertTrace as UpsertTrace (action)
    participant DuckDB

    Scheduler->>PollTraceLog: trigger()
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
| PollTraceLog | `c.WoodstockServer.Index.Actions.PollTraceLog` |
| UpsertTrace | `c.WoodstockServer.Index.Actions.UpsertTrace` |
| IndexState | `c.WoodstockServer.Index.Models.IndexState` |
| FileStorage | `c.WoodstockSdk.Storage.Models.FileStorage` |

