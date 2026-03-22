# Implementation notes — ms1

## S3 directory layout

The full S3 bucket structure is:

```
traces/           # the trace log — one JSON file per trace record
  {uuidv7}.json
tree/             # blob annex — arbitrary payload blobs keyed by trace_key
  {trace_key}/
    {blob_name}
db/               # maintained by woodstock-server
  index.duckdb    # (or Parquet files as an alternative)
```

## TraceRecord JSON shape

A full trace record looks like this:

```json
{
  "trace_key": "job-123/calc-456/calculation_started",
  "trace_state": "",
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
