# Implementation Plan

## Dependency on scenarios and implementation_nodes.md

This plan depends on scenarios stored in extra/spec_src/scenarios.
Each scenario may have an assocatiated implementation_nodes.md document that should also be consulted.

## Phases

### Phase 1 — FileStorage abstraction (ms1)

- [ ] `Storage.Models.FileStorage` — abstract base with `put_file`, `get_file`, `list_files`, `delete_files`
- [ ] `Storage.Models.LocalFsFileStorage` — filesystem implementation
- [ ] `Storage.Models.S3FileStorage` — boto3 implementation
- [ ] Settings: select backend from environment (`s3_bucket` → S3, `base_path` → LocalFs)

> See [ms1](extra/spec_src/scenarios/ms1_woodstock_uses_a_pluggable_file_storage/scenario.py) for interface contract and `list_files` cursor semantics.

Manual test: instantiate `LocalFsFileStorage`, call `put_file`, `get_file`, `list_files` with a `start_after` cursor, `delete_files`.

---

### Phase 2 — Write a simple trace (ms2)

Depends on: Phase 1

- [ ] `Trace.Models.TraceRecord`
- [ ] `Trace.Models.TraceLogEntry`
- [ ] `Trace.Actions.WriteTrace` — builds record, writes to `traces/{uuidv7}.json` via `FileStorage`

> See [ms2](extra/spec_src/scenarios/ms2_a_client_writes_a_simple_trace/scenario.py).

Manual test: call `WriteTrace`, verify the JSON file appears under `traces/`.

---

### Phase 3 — Write a trace with a payload blob (ms3)

Depends on: Phase 2

- [ ] `Trace.Models.Blob`
- [ ] `Trace.Actions.UploadBlob` — writes blob to `tree/{trace_key}/{blob_name}`, returns `tree://` ref
- [ ] Extend `WriteTrace` to accept `blobs`, call `UploadBlob` per blob, insert refs into payload

> See [ms3](extra/spec_src/scenarios/ms3_a_client_writes_a_trace_with_a_payload_blob/scenario.py).

---

### Phase 4 — Server indexes new traces (ms4)

Depends on: Phase 2

- [ ] Maarten will create the basic django-admin file structure for woodstock_server
- [ ] `WoodstockServer.Index.Models.IndexState` — persists `last_seen_key`
- [ ] `WoodstockServer.Index.Models.TraceRecord` (server-side view)
- [ ] `WoodstockServer.Index.Actions.UpsertTrace` — inserts/updates row in DuckDB
- [ ] `WoodstockServer.Index.Actions.PollTraceLog` — reads `last_seen_key`, calls `list_files`, fetches + upserts each new entry, advances cursor

> See [ms4](extra/spec_src/scenarios/ms4_the_woodstock_server_indexes_new_traces/scenario.py) for cursor logic and DuckDB schema notes.

Manual test: write a few traces via Phase 2, run `PollTraceLog`, verify DuckDB rows.

---

### Phase 5 — UI queries and displays traces; retention (ms5)

Depends on: Phases 3 and 4
Scope: this phase covers the server side. The UI will be implemented in a separate phase later.

- [ ] `WoodstockServer.Query.Actions.QueryTraces` — DuckDB query with filter (prefix, state, writer, time range), returns `TraceList`
- [ ] `WoodstockServer.Query.Models.TraceList`, `BlobContent`
- [ ] `WoodstockServer.Query.Actions.FetchBlob` — calls `FileStorage.get_file`, returns `BlobContent`
- [ ] `WoodstockSdk.Traces.Actions.DeleteTraces` — deletes trace log entries, tree objects, DuckDB rows for a retention cutoff
- [ ] `WoodstockServer.Manage.Actions.DeleteOldTraces` — django-admin entry point, delegates to `DeleteTraces`
- [ ] `WoodstockServer.Manage.Models.RetentionPeriod`

> See [ms5](extra/spec_src/scenarios/ms5_the_woodstock_ui_queries_and_displays_traces/scenario.py).
