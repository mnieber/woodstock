import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario("ms6_the_woodstock_ui_queries_and_displays_traces")


def run_scenario():
    Server = c.Woodstock.Server
    Storage = c.Woodstock.Storage
    External = c.External

    r.user = External.Actors.User
    r.woodstock_ui = External.Actors.WoodstockUi
    r.operator = External.Actors.Operator
    r.query_traces_action = Server.Actions.QueryTraces
    r.fetch_blob_action = Server.Actions.FetchBlob
    r.trace_list = Server.Models.TraceList
    r.blob_content = Server.Models.BlobContent
    r.delete_old_traces_action = Server.Actions.DeleteOldTraces
    r.retention_days = Server.Models.RetentionDays
    r.file_storage = Storage.Models.FileStorage

    with goal().display_a(r.trace_list).with_the(r.blob_content).for_the(r.user):
        with the(r.user).opens_the(r.woodstock_ui).and_applies_a(r.filter):
            the(r.woodstock_ui).calls_the(r.query_traces_action).with_the(r.filter)

        with the(r.query_traces_action).queries_the(r.duckdb_index).with_the(r.filter):
            it().filters_by(r.trace_key_prefix).and_or(r.trace_state).and_or(
                r.author
            ).and_or(r.time_range)
            it().returns_the(r.trace_list)

        with the(r.woodstock_ui).renders_the(r.trace_list).as_a(r.trace_tree):
            with it().calls_the(r.fetch_blob_action).for_each(r.tree_ref).in_the(
                r.trace_list
            ):
                it().calls_the(r.file_storage).get_file(r.tree_path).to_get_the(
                    r.blob_content
                )
                it().returns_the(r.blob_content)
            it().renders_the(r.blob_content).in_the(r.documents_section)

    with goal().delete_traces_older_than_the(r.retention_period):
        with the(r.operator).runs_the(r.delete_old_traces_entrypoint).with_the(
            r.retention_days
        ):
            it().calls_the(r.delete_old_traces_action).with_the(r.retention_days)

        with the(r.delete_old_traces_action).deletes_traces_older_than_the(
            r.retention_days
        ):
            it().calls_the(r.file_storage).delete_files(r.trace_log_entries)
            it().calls_the(r.file_storage).delete_files(r.trace_records)
            it().removes_the(r.index_rows).from_the(r.duckdb_index)


markdown_node = sunya.add_markdown_node(
    scenario, "The woodstock UI queries and displays traces"
)
markdown_node.markdown = """
The woodstock UI lets a user browse and filter the trace tree. It queries the woodstock-server,
which answers from its DuckDB index. The indexer and the server share a DuckDB file on disk
(path configured via `WOODSTOCK_DUCKDB_PATH`), so traces written by the indexer are immediately
queryable by the server.

When rendering a trace, all `tree://` payload references are fetched immediately so the user
sees the full trace — including any Markdown documents or JSON blobs — without having to click
through.

An operator can also run the `delete-old-traces` CLI entrypoint to delete traces older than a
given number of days. The entrypoint calls `DeleteOldTraces` directly, which removes the
matching entries from the S3 trace log, the S3 tree, and the DuckDB index.

The woodstock-server is a Bottle-based HTTP server.

## Steps

### It sends a filter query to the server

The user opens the woodstock UI and optionally sets filters (trace key prefix, trace state,
author, time range).</br>
The UI sends the filter to the `QueryTraces` action on the woodstock-server.</br>

### It queries the DuckDB index

`QueryTraces` translates the filter into a DuckDB query and returns a `TraceList`.</br>
The response includes `trace_key`, `trace_state`, `author`, `timestamp`, and the full payload
for each matching trace.</br>
Because the index is a local DuckDB file shared with the indexer, this query is fast even over
large trace histories.</br>

### It renders the trace tree and fetches all blobs

The UI groups results by `trace_key` prefix to show the hierarchical tree.</br>
Each node's payload fields are rendered according to their DSL prefix:
`value://` as a key-value table, `link://` as clickable external links, and `ref://` as
navigable cross-references within the woodstock UI.</br>
For every `tree://` reference in the payload, the UI calls `FetchBlob` on the woodstock-server,
which calls `FileStorage.get_file(tree_path)` and returns the content as `BlobContent`.</br>
The blob is rendered immediately in the documents section — no additional user interaction
is required.</br>

### It deletes old traces via the CLI

An operator runs the `delete-old-traces` entrypoint with a `--retention-days` argument (integer
number of days).</br>
The entrypoint calls `DeleteOldTraces` with the given number of days.</br>
`DeleteOldTraces` calls `FileStorage.delete_files` for the matching trace log entries, then
again for the corresponding tree objects, and finally purges the matching rows from the
DuckDB index.</br>

## Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as WoodstockUi
    participant QueryTraces as QueryTraces (action)
    participant DuckDB
    participant FetchBlob as FetchBlob (action)
    participant FileStorage
    participant Operator
    participant DeleteOldTraces as DeleteOldTraces (action)

    User->>UI: open / apply filter
    UI->>QueryTraces: query_traces(filter)
    QueryTraces->>DuckDB: SELECT ... WHERE ...
    DuckDB-->>QueryTraces: rows
    QueryTraces-->>UI: TraceList

    loop for each tree:// reference in TraceList
        UI->>FetchBlob: fetch_blob(tree_path)
        FetchBlob->>FileStorage: get_file("tree/{tree_path}")
        FileStorage-->>FetchBlob: raw content
        FetchBlob-->>UI: BlobContent
    end

    UI->>UI: render trace tree (values, links, refs, blobs)
    UI-->>User: trace tree view

    Operator->>DeleteOldTraces: delete-old-traces --retention-days 7
    DeleteOldTraces->>FileStorage: delete_files(trace log entries older than cutoff)
    DeleteOldTraces->>FileStorage: delete_files(tree objects for deleted traces)
    DeleteOldTraces->>DuckDB: DELETE rows older than cutoff
```

### Legend

| Participant | Module path |
|---|---|
| QueryTraces | `c.Woodstock.Server.Actions.QueryTraces` |
| FetchBlob | `c.Woodstock.Server.Actions.FetchBlob` |
| DeleteOldTraces | `c.Woodstock.Server.Actions.DeleteOldTraces` |
| RetentionDays | integer number of days passed directly as a CLI argument |
| FileStorage | `c.Woodstock.Storage.Models.FileStorage` |
"""
