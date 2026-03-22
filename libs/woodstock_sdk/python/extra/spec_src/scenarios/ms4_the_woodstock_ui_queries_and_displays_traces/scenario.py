import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario(
    "ms4_the_woodstock_ui_queries_and_displays_traces"
)


def run_scenario():
    Query = c.WoodstockServer.Query
    External = c.External

    r.user = External.Actors.User
    r.woodstock_ui = External.Actors.WoodstockUi
    r.query_traces_action = Query.Actions.QueryTraces
    r.trace_list = Query.Models.TraceList

    with goal().display_a(r.trace_list).for_the(r.user):
        with the(r.user).opens_the(r.woodstock_ui).and_applies_a(r.filter):
            the(r.woodstock_ui).calls_the(r.query_traces_action).with_the(r.filter)

        with the(r.query_traces_action).queries_the(r.duckdb_index).with_the(r.filter):
            it().filters_by(r.trace_key_prefix).and_or(r.trace_state).and_or(
                r.writer
            ).and_or(r.time_range)
            it().returns_the(r.trace_list)

        the(r.woodstock_ui).renders_the(r.trace_list).as_a(r.trace_tree)


markdown_node = sunya.add_markdown_node(
    scenario, "The woodstock UI queries and displays traces"
)
markdown_node.markdown = """
The woodstock UI lets a user browse and filter the trace tree. It queries the woodstock-server,
which answers purely from its DuckDB index — no S3 access is needed at this stage.

### Steps

#### It sends a filter query to the server

The user opens the woodstock UI and optionally sets filters (trace key prefix, trace state,
writer, time range).</br>
The UI sends the filter to the `QueryTraces` action on the woodstock-server.</br>

#### It queries the DuckDB index

`QueryTraces` translates the filter into a DuckDB query and returns a `TraceList`.</br>
The response includes `trace_key`, `trace_state`, `writer`, `timestamp`, and the inline
payload for each matching trace — everything needed to render the tree view.</br>
Because the index is local to the server, this query is fast even over large trace histories.</br>

#### It renders the trace tree

The UI groups results by `trace_key` prefix to show the hierarchical tree.</br>
Each node displays its `trace_state` as a badge and its payload fields grouped by DSL prefix
(`value://` as a key-value table, `link://` as clickable links, `ref://` as navigable
cross-references within the UI, `tree://` as on-demand document links).</br>

### Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as WoodstockUi
    participant QueryTraces as QueryTraces (action)
    participant DuckDB

    User->>UI: open / apply filter
    UI->>QueryTraces: query_traces(filter)
    QueryTraces->>DuckDB: SELECT ... WHERE ...
    DuckDB-->>QueryTraces: rows
    QueryTraces-->>UI: TraceList
    UI->>UI: render trace tree
    UI-->>User: trace tree view
```
"""
