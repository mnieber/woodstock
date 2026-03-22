import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario(
    "ms3_the_woodstock_server_indexes_new_traces"
)


def run_scenario():
    Index = c.WoodstockServer.Index
    External = c.External

    r.poll_trace_log_action = Index.Actions.PollTraceLog
    r.upsert_trace_action = Index.Actions.UpsertTrace
    r.index_state = Index.Models.IndexState
    r.trace_record = Index.Models.TraceRecord
    r.scheduler = External.Actors.Scheduler

    with goal().keep_the(r.duckdb_index).up_to_date_with_the(r.trace_log):
        with the(r.scheduler).triggers_the(r.poll_trace_log_action).on_an(r.interval):
            with it().lists_the(r.trace_log).starting_after_the(
                r.last_seen_key
            ).from_the(r.index_state):
                it().reads_the(r.last_seen_key).from_the(r.index_state)
                it().lists_the(r.new_entries).from_the(
                    r.trace_log
                ).using_start_after_the(r.last_seen_key)

            with it().processes_each(r.new_entry).in_the(r.new_entries):
                it().reads_the(r.trace_record).from_the(r.new_entry)
                it().calls_the(r.upsert_trace_action).with_the(r.trace_record)
                it().updates_the(r.last_seen_key).in_the(r.index_state)


markdown_node = sunya.add_markdown_node(
    scenario, "The woodstock-server indexes new traces"
)
markdown_node.markdown = """
The woodstock-server maintains a DuckDB index that it builds incrementally from the append-only
trace log on S3. A scheduler triggers a poll at a regular interval; the server fetches only
the entries it has not yet seen and upserts them into the index.

### Steps

#### It finds new trace log entries

`PollTraceLog` reads the `last_seen_key` from `IndexState` — the UUID v7 key of the last
trace log entry it processed.</br>
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
    participant PollTraceLog as PollTraceLog (action)
    participant IndexState
    participant S3
    participant UpsertTrace as UpsertTrace (action)
    participant DuckDB

    Scheduler->>PollTraceLog: trigger()
    PollTraceLog->>IndexState: read last_seen_key
    PollTraceLog->>S3: list traces/ StartAfter=last_seen_key
    S3-->>PollTraceLog: new_entries

    loop for each new_entry
        PollTraceLog->>S3: GET traces/{uuidv7}.json
        S3-->>PollTraceLog: TraceRecord
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
"""
