[comment]: <> (This file is auto-generated. Do not edit directly.)

# Scenario: ms4_the_woodstock_ui_queries_and_displays_traces

## The woodstock UI queries and displays traces

The woodstock UI lets a user browse and filter the trace tree. It queries the woodstock-server,
which answers from its DuckDB index. When rendering a trace, all `tree://` payload references
are fetched immediately so the user sees the full trace — including any Markdown documents or
JSON blobs — without having to click through.

### Steps

#### It sends a filter query to the server

The user opens the woodstock UI and optionally sets filters (trace key prefix, trace state,
writer, time range).</br>
The UI sends the filter to the `QueryTraces` action on the woodstock-server.</br>

#### It queries the DuckDB index

`QueryTraces` translates the filter into a DuckDB query and returns a `TraceList`.</br>
The response includes `trace_key`, `trace_state`, `writer`, `timestamp`, and the full payload
for each matching trace.</br>
Because the index is local to the server, this query is fast even over large trace histories.</br>

#### It renders the trace tree and fetches all blobs

The UI groups results by `trace_key` prefix to show the hierarchical tree.</br>
Each node's payload fields are rendered according to their DSL prefix:
`value://` as a key-value table, `link://` as clickable external links, and `ref://` as
navigable cross-references within the woodstock UI.</br>
For every `tree://` reference in the payload, the UI calls `FetchBlob` on the woodstock-server,
which retrieves the raw content from the S3 tree and returns it as `BlobContent`.</br>
The blob is rendered immediately in the documents section — no additional user interaction
is required.</br>

### Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as WoodstockUi
    participant QueryTraces as QueryTraces (action)
    participant DuckDB
    participant FetchBlob as FetchBlob (action)
    participant S3

    User->>UI: open / apply filter
    UI->>QueryTraces: query_traces(filter)
    QueryTraces->>DuckDB: SELECT ... WHERE ...
    DuckDB-->>QueryTraces: rows
    QueryTraces-->>UI: TraceList

    loop for each tree:// reference in TraceList
        UI->>FetchBlob: fetch_blob(tree_path)
        FetchBlob->>S3: GET tree/{tree_path}
        S3-->>FetchBlob: raw content
        FetchBlob-->>UI: BlobContent
    end

    UI->>UI: render trace tree (values, links, refs, blobs)
    UI-->>User: trace tree view
```

### Legend

| Participant | Module path |
|---|---|
| QueryTraces | `c.WoodstockServer.Query.Actions.QueryTraces` |
| FetchBlob | `c.WoodstockServer.Query.Actions.FetchBlob` |

