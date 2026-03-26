# Implementation notes — ms1

## trace_key structure and events

Traces correspond to events. The `trace_key` is a path that identifies a specific event within
the trace tree: `{job-id}/{node}/{event}`. The node segment groups related events together;
the event segment names the specific occurrence. For example:

- `job-123/calc-456/calculation_scheduled`
- `job-123/calc-456/calculation_running`
- `job-123/calc-456/calculation_failed`

Each of these is a separate trace record with its own payload. The woodstock UI groups them
under the `job-123/calc-456` node when rendering the tree.

## S3 directory layout

The full S3 bucket structure is:

```
traces/           # the trace log — one JSON file per trace record
  {uuidv7}.json
tree/             # blob annex — arbitrary payload blobs keyed by trace_key
  {job-id}/
    {node}/
      {blob_name}
db/               # maintained by woodstock-server
  index.duckdb    # (or Parquet files as an alternative)
```

## TraceRecord JSON shape

A full trace record looks like this:

```json
{
  "trace_key": "job-123/calc-456/calculation_failed",
  "trace_state": "error",
  "writer": "calcium",
  "timestamp": "2026-03-22T14:32:01Z",
  "payload": {
    "severity": "value://high",
    "calculation_page": "link://https://calcite/jobs/123/calculations/abc",
    "error_summary": "value://Division by zero in band normalization",
    "full_error": "tree://job-123/calc-456/error.md"
  }
}
```

## trace_state as controlled vocabulary

For now, `trace_state` can only be "" (empty string, everything fine), "warning" or "error", rather than a free-form string.
This makes the DuckDB index immediately useful for filtering (e.g. "show all failed nodes in the last hour").

## SDK simplicity

A key design goal: the SDK should be trivially implementable in any language.
For a simple trace it is just one S3 PUT; for a trace with blobs it is one PUT per blob plus one PUT for the record.
Avoid adding SDK complexity that would make a Go or other-language port non-trivial.
