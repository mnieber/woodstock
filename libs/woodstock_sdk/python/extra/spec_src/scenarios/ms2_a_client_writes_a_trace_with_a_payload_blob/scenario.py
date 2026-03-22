import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario(
    "ms2_a_client_writes_a_trace_with_a_payload_blob"
)


def run_scenario():
    Trace = c.WoodstockSdk.Trace
    External = c.External

    r.client = External.Actors.Client
    r.write_trace_action = Trace.Actions.WriteTrace
    r.upload_blob_action = Trace.Actions.UploadBlob
    r.trace_record = Trace.Models.TraceRecord
    r.blob = Trace.Models.Blob

    with goal().write_a(r.trace_record).with_a(r.blob).to_the(r.whats_new_log):
        with the(r.client).calls_the(r.write_trace_action).with_the(
            r.trace_key
        ).and_the(r.trace_state).and_the(r.payload).and_the(r.blobs):
            with it().calls_the(r.upload_blob_action).for_each(r.blob).in_the(
                r.blobs
            ):
                it().uploads_the(r.blob).to_the(
                    r.tree_path
                ).under_the(r.trace_key)
                it().replaces_the(r.payload_value).with_a(
                    r.tree_ref
                ).of_the_form("tree://{tree_path}")
            it().writes_the(r.trace_record).to_the(
                r.whats_new_log
            ).using_a(r.uuidv7_key)
            it().returns_the(r.trace_record)


markdown_node = sunya.add_markdown_node(
    scenario, "A client writes a trace with a payload blob"
)
markdown_node.markdown = """
When a trace payload contains large or rich content (e.g. a Markdown error report), the client
passes blobs alongside the trace. The SDK uploads each blob to the S3 tree first, then writes a
lightweight trace record that references the blob via a `tree://` DSL value.

### Steps

#### It uploads each blob to the S3 tree

For every `Blob` supplied by the client, `UploadBlob` writes the blob's content to
`tree/{trace_key}/{blob_name}` on S3.</br>
The corresponding payload field in the trace record is updated to a `tree://` reference,
e.g. `"error.md": "tree://job-123/calc-456/error.md"`.</br>
This keeps the whats-new entry small while the rich content lives in the tree.</br>

#### It writes the trace record to the whats-new log

With all blob references resolved, `WriteTrace` writes the `TraceRecord` to
`whats-new/{uuidv7}.json` — identical to the simple trace case.</br>
The woodstock-server never needs to crawl the tree to build its index;
it only fetches tree paths when a user requests to view a specific payload.</br>

### Diagram

```mermaid
sequenceDiagram
    participant Client
    participant WriteTrace as WriteTrace (action)
    participant UploadBlob as UploadBlob (action)
    participant S3

    Client->>WriteTrace: write_trace(trace_key, trace_state, payload, blobs)

    loop for each blob
        WriteTrace->>UploadBlob: upload_blob(trace_key, blob)
        UploadBlob->>S3: PUT tree/{trace_key}/{blob_name}
        UploadBlob-->>WriteTrace: tree_path
        WriteTrace->>WriteTrace: replace payload value with tree://{tree_path}
    end

    WriteTrace->>S3: PUT whats-new/{uuidv7}.json
    WriteTrace-->>Client: TraceRecord
```
"""
