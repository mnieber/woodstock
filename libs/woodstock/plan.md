# Implementation Plan

## Dependency on scenarios and implementation_notes.md

This plan depends on scenarios stored in extra/spec_src/scenarios.
Each scenario may have an assocatiated implementation_notes.md document that should also be consulted.

## Phases

### Phase 1 — FileStorage abstraction (ms1)

- [ ] `Storage.Models.FileStorage` — abstract base with `put_file`, `get_file`, `list_files`, `delete_files`
- [ ] `Storage.Models.LocalFsFileStorage` — filesystem implementation
- [ ] `Storage.Models.S3FileStorage` — boto3 implementation
- [ ] Settings: select backend from environment (`s3_bucket` → S3, `base_path` → LocalFs)

> See [ms1](extra/spec_src/scenarios/ms1_woodstock_uses_a_pluggable_file_storage/scenario.py) for interface contract and `list_files` cursor semantics. See implementation_notes.md about reusing code from calcium_sdk.

Write a once-off test: instantiate `LocalFsFileStorage`, call `put_file`, `get_file`, `list_files` with a `start_after` cursor, `delete_files`. Run the once-off and fix bugs if needed.

---

### Phase 2 — Write a simple trace (ms2)

Depends on: Phase 1

- [ ] `Trace.Models.TraceRecord`
- [ ] `Trace.Actions.WriteTrace` — builds record, writes to `traces/{uuidv7}.json` via `FileStorage`

> See [ms2](extra/spec_src/scenarios/ms2_a_client_writes_a_simple_trace/scenario.py).

Write a once-off test: call `WriteTrace`, verify the JSON file appears under `traces/`. Run the once-off and fix bugs if needed.

---

### Phase 3 — Write a trace with a payload blob (ms3)

Depends on: Phase 2

- [ ] `Trace.Models.Blob`
- [ ] `Trace.Actions.UploadBlob` — writes blob to `tree/{trace_key}/{blob_name}`, returns `tree://` ref
- [ ] Extend `WriteTrace` to accept `blobs`, call `UploadBlob` per blob, insert refs into payload

> See [ms3](extra/spec_src/scenarios/ms3_a_client_writes_a_trace_with_a_payload_blob/scenario.py).

---

### Phase 4 — Label trace nodes (ms4)

Depends on: Phase 2

- [ ] Extend `TraceRecord` with optional `labels` field
- [ ] Extend `WriteTraceForm` to accept `label_patch`, pass through into `TraceRecord`

> See [ms4](extra/spec_src/scenarios/ms4_a_client_labels_trace_nodes/scenario.py) for label structure, null-drop semantics, and replay model.

---

### Phase 5 — Server indexes new traces (ms5)

Depends on: Phases 2 and 4

- [ ] `Woodstock.Server.Models.IndexState` — persists `last_seen_key`
- [ ] `Woodstock.Server.Models.TraceRecord` (server-side view)
- [ ] `Woodstock.Server.Actions.UpsertTrace` — inserts/updates row in DuckDB
- [ ] `Woodstock.Server.Actions.PollTraceLog` — reads `last_seen_key`, calls `list_files`, fetches + upserts each new entry, advances cursor

> See [ms5](extra/spec_src/scenarios/ms5_the_woodstock_server_indexes_new_traces/scenario.py) for cursor logic and DuckDB schema notes. `UpsertTrace` will need to apply label patches per `(node_key, label_name)` in UUID v7 order — see ms4 for replay semantics.

Manual test: write a few traces via Phase 2, run `PollTraceLog`, verify DuckDB rows.

---

### Phase 6 — UI queries and displays traces; retention (ms6)

Depends on: Phases 3, 4, and 5
Scope: this phase covers the server side. The UI will be implemented in a separate phase later.

**Models:**
- [ ] `Woodstock.Server.Models.TraceList`
- [ ] `Woodstock.Server.Models.BlobContent`
- [ ] `Woodstock.Server.Models.RetentionPeriod` — enum: one-week, two-weeks, one-month

**Actions:**
- [ ] `Woodstock.Server.Actions.QueryTraces` — queries shared DuckDB file with optional filter (prefix, state, author, time range), returns `TraceList`
- [ ] `Woodstock.Server.Actions.FetchBlob` — calls `FileStorage.get_file(tree_path)`, returns `BlobContent`
- [ ] `Woodstock.Server.Actions.DeleteOldTraces` — deletes matching trace log entries and tree objects via `FileStorage`, purges DuckDB rows older than the retention cutoff

**Entrypoints:**
- [ ] `Woodstock.Server.Entrypoints.WoodstockerServer` — Bottle HTTP server exposing `QueryTraces` and `FetchBlob`
- [ ] `Woodstock.Server.Entrypoints.DeleteOldTraces` — CLI entrypoint; parses `--retention-period`, calls `DeleteOldTraces`

**Settings:**
- [ ] Add `WOODSTOCK_DUCKDB_PATH` to `settings.py` — path to the shared DuckDB file used by both the indexer and the server

**pyproject.toml:**
- [ ] Add `woodstock-server` and `delete-old-traces` to `[project.scripts]`
- [ ] Add `bottle` to dependencies

**Integration test:**
- [ ] `env/test/tests/test_server.py` — writes traces, runs indexer, queries the server's `QueryTraces` endpoint, asserts returned `TraceList` is correct

> See [ms6](extra/spec_src/scenarios/ms6_the_woodstock_ui_queries_and_displays_traces/scenario.py).
