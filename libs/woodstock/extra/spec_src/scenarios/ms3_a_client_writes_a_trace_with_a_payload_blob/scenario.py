import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario("ms3_a_client_writes_a_trace_with_a_payload_blob")


def run_scenario():
    Trace = c.Woodstock.Trace
    Storage = c.Woodstock.Storage
    External = c.External

    r.client = External.Actors.Client
    r.write_trace_action = Trace.Actions.WriteTrace
    r.upload_blob_action = Trace.Actions.UploadBlob
    r.trace_record = Trace.Models.TraceRecord
    r.blob = Trace.Models.Blob
    r.file_storage = Storage.Models.FileStorage

    with goal().write_a(r.trace_record).with_a(r.blob).to_the(r.trace_log):
        with the(r.client).calls_the(r.write_trace_action).with_the(
            r.trace_key
        ).and_the(r.trace_state).and_the(r.payload).and_the(r.blobs):
            with it().calls_the(r.upload_blob_action).for_each(r.blob).in_the(r.blobs):
                it().calls_the(r.file_storage).put_file(r.blob).at_path(
                    "tree/{trace_key}/{blob_name}"
                )
                it().inserts_a(r.tree_ref).of_the_form("tree://{tree_path}").into_the(
                    r.payload
                )
            it().calls_the(r.file_storage).put_file(r.trace_record).at_path(
                "traces/{uuidv7}.json"
            )
            it().returns_the(r.trace_record)


markdown_node = sunya.add_markdown_node(
    scenario, "A client writes a trace with a payload blob"
)
markdown_node.markdown = """
When a trace payload contains large or rich content (e.g. a Markdown error report), the client
passes blobs alongside the trace. Woodstock uploads each blob to the file storage tree first,
then inserts a `tree://` reference into the payload alongside any other DSL-prefixed values
already there (e.g. `value://`, `link://`, `ref://`). The resulting trace record written to
the trace log is lightweight, while the rich content lives in the tree.

## Steps

### It uploads each blob to the tree

For every `Blob` supplied by the client, `UploadBlob` calls `FileStorage.put_file` to write
the blob's content at `tree/{trace_key}/{blob_name}` and returns the tree path.</br>
A `tree://` reference for that path is then inserted into the payload dict as an additional
key alongside whatever `value://`, `link://`, or `ref://` keys the client already provided.</br>
For example, a payload might contain `"severity": "value://high"`,
`"calculation_page": "link://https://calcite/jobs/123/calculations/abc"`, and
`"full_error": "tree://job-123/calc-456/error.md"` all at once.</br>

### It writes the trace record to the trace log

With all blob references inserted, `WriteTrace` calls `FileStorage.put_file` to write the
`TraceRecord` to `traces/{uuidv7}.json` — identical to the simple trace case.</br>
The woodstock-server never needs to crawl the tree to build its index;
it only fetches tree paths when rendering a trace for the user.</br>

## Diagram

```mermaid
sequenceDiagram
    participant Client
    participant WriteTrace as WriteTrace (action)
    participant UploadBlob as UploadBlob (action)
    participant FileStorage

    Client->>WriteTrace: write_trace(trace_key, trace_state, payload, blobs)

    loop for each blob
        WriteTrace->>UploadBlob: upload_blob(trace_key, blob)
        UploadBlob->>FileStorage: put_file("tree/{trace_key}/{blob_name}", content)
        UploadBlob-->>WriteTrace: tree_path
        WriteTrace->>WriteTrace: insert tree://{tree_path} into payload
    end

    WriteTrace->>FileStorage: put_file("traces/{uuidv7}.json", trace_record)
    WriteTrace-->>Client: TraceRecord
```

### Legend

| Participant | Module path |
|---|---|
| WriteTrace | `c.Woodstock.Trace.Actions.WriteTrace` |
| UploadBlob | `c.Woodstock.Trace.Actions.UploadBlob` |
| FileStorage | `c.Woodstock.Storage.Models.FileStorage` |
"""
