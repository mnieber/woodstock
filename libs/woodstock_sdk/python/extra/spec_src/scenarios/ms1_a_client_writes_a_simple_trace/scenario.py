import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario(
    "ms1_a_client_writes_a_simple_trace"
)


def run_scenario():
    Trace = c.WoodstockSdk.Trace
    External = c.External

    r.client = External.Actors.Client
    r.write_trace_action = Trace.Actions.WriteTrace
    r.trace_record = Trace.Models.TraceRecord
    r.trace_log_entry = Trace.Models.TraceLogEntry

    with goal().write_a(r.trace_record).to_the(r.trace_log):
        with the(r.client).calls_the(r.write_trace_action).with_the(
            r.trace_key
        ).and_the(r.trace_state).and_the(r.payload):
            it().creates_the(r.trace_record).with_the(
                r.trace_key
            ).and_the(r.trace_state).and_the(r.payload).and_a(r.timestamp).and_a(
                r.writer
            )
            it().writes_the(r.trace_record).to_the(
                r.trace_log
            ).as_a(r.trace_log_entry).using_a(r.uuidv7_key)
            it().returns_the(r.trace_record)


markdown_node = sunya.add_markdown_node(
    scenario, "A client writes a simple trace"
)
markdown_node.markdown = """
A client (e.g. calcium, calcite) uses the woodstock_sdk to write a trace record.
For a simple trace — one with no large payload blobs — a single PUT to S3 is all that is needed.

Traces correspond to events. A `trace_key` identifies a specific event within the trace tree,
structured as a path: `{job-id}/{node}/{event}`. For example, `job-123/calc-456` is the
trace node for a calculation, and `job-123/calc-456/calculation_started`,
`job-123/calc-456/calculation_running`, and `job-123/calc-456/calculation_failed` are
individual event traces within that node. Each event trace has its own payload describing
what happened at that point.

### Steps

#### It builds the trace record

The `WriteTrace` action constructs a `TraceRecord` from the supplied `trace_key`, `trace_state`,
and `payload` dict, adding a UTC `timestamp` and the configured `writer` name.</br>
The `payload` uses the woodstock DSL: values are prefixed with `value://`, `link://`, `ref://`,
or `tree://` to describe how the UI should render each field.</br>

#### It writes the trace record to the trace log

The action generates a UUID v7 key (lexicographically time-ordered) and writes the
`TraceRecord` as a JSON file to `traces/{uuidv7}.json` on S3.</br>
Because S3 list operations are lexicographically ordered, the woodstock-server can later
use `StartAfter` on the last-seen key to find only new entries — no coordination needed.</br>

### Diagram

```mermaid
sequenceDiagram
    participant Client
    participant WriteTrace as WriteTrace (action)
    participant S3

    Client->>WriteTrace: write_trace(trace_key, trace_state, payload)
    WriteTrace->>WriteTrace: build TraceRecord (+ timestamp, writer)
    WriteTrace->>S3: PUT traces/{uuidv7}.json
    WriteTrace-->>Client: TraceRecord
```

### Legend

| Participant | Module path |
|---|---|
| WriteTrace | `c.WoodstockSdk.Trace.Actions.WriteTrace` |
"""
