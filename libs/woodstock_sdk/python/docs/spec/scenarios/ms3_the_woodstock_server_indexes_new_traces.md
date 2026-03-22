[comment]: <> (This file is auto-generated. Do not edit directly.)

# Scenario: ms3_the_woodstock_server_indexes_new_traces

## The woodstock-server indexes new traces

The woodstock-server maintains a DuckDB index that it builds incrementally from the append-only
whats-new log on S3. A scheduler triggers a poll at a regular interval; the server fetches only
the entries it has not yet seen and upserts them into the index.

### Steps

#### It finds new whats-new entries

`PollWhatsNew` reads the `last_seen_key` from `IndexState` — the UUID v7 key of the last
whats-new entry it processed.</br>
It calls `S3.list_objects` with `StartAfter={last_seen_key}` to retrieve only newer entries.</br>
Because UUID v7 keys are lexicographically ordered by time, this is always correct — no
coordination or locking is needed.</br>

#### It upserts each new trace into the DuckDB index

For each new entry, the server reads the `TraceRecord` JSON and calls `UpsertTrace` to insert
or update the row in DuckDB (keyed on `trace_key` + `uuidv7`).</br>
After processing each entry, it advances the `last_seen_key` in `IndexState`.</br>
The DuckDB index is now queryable for filtering by `trace_key`, `trace_state`, `writer`,
and `timestamp` — without touching the S3 tree.</br>

### Diagram

```mermaid
sequenceDiagram
    participant Scheduler
    participant PollWhatsNew as PollWhatsNew (action)
    participant IndexState
    participant S3
    participant UpsertTrace as UpsertTrace (action)
    participant DuckDB

    Scheduler->>PollWhatsNew: trigger()
    PollWhatsNew->>IndexState: read last_seen_key
    PollWhatsNew->>S3: list whats-new/ StartAfter=last_seen_key
    S3-->>PollWhatsNew: new_entries

    loop for each new_entry
        PollWhatsNew->>S3: GET whats-new/{uuidv7}.json
        S3-->>PollWhatsNew: TraceRecord
        PollWhatsNew->>UpsertTrace: upsert(TraceRecord)
        UpsertTrace->>DuckDB: INSERT OR REPLACE trace row
        PollWhatsNew->>IndexState: update last_seen_key = uuidv7
    end
```

