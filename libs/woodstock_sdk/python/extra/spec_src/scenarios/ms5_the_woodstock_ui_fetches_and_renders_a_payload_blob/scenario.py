import sunya
from sunya import C as c
from sunya import R as r
from sunya import goal, it, the

scenario = sunya.add_scenario(
    "ms5_the_woodstock_ui_fetches_and_renders_a_payload_blob"
)


def run_scenario():
    Query = c.WoodstockServer.Query
    External = c.External

    r.user = External.Actors.User
    r.woodstock_ui = External.Actors.WoodstockUi
    r.fetch_blob_action = Query.Actions.FetchBlob
    r.blob_content = Query.Models.BlobContent

    with goal().render_a(r.payload_blob).for_the(r.user):
        the(r.user).clicks_a(r.tree_ref).in_the(r.woodstock_ui)

        with the(r.woodstock_ui).calls_the(r.fetch_blob_action).with_the(r.tree_path):
            it().fetches_the(r.blob_content).from_the(r.s3_tree).at_the(r.tree_path)
            it().returns_the(r.blob_content)

        the(r.woodstock_ui).renders_the(r.blob_content).in_the(r.documents_section)


markdown_node = sunya.add_markdown_node(
    scenario, "The woodstock UI fetches and renders a payload blob"
)
markdown_node.markdown = """
When a user clicks on a `tree://` reference in a trace payload, the woodstock UI fetches the
blob from S3 via the woodstock-server and renders it in the documents section of the trace view.

### Steps

#### It requests the blob from the server

The user clicks a `tree://` payload field (e.g. `"full_error": "tree://job-123/calc-456/error.md"`).</br>
The UI strips the `tree://` prefix and calls `FetchBlob` on the woodstock-server with the
resolved S3 tree path.</br>

#### It fetches the blob from S3

`FetchBlob` retrieves the raw content from `tree/{tree_path}` on S3 and returns it as
`BlobContent`, including the content type so the UI knows how to render it.</br>
Common types are Markdown (rendered as formatted text) and JSON (rendered as a code block).</br>

#### It renders the blob in the documents section

The UI displays the blob content in the documents section of the trace view, below the
key-value and links sections.</br>

### Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as WoodstockUi
    participant FetchBlob as FetchBlob (action)
    participant S3

    User->>UI: click tree:// payload field
    UI->>FetchBlob: fetch_blob(tree_path)
    FetchBlob->>S3: GET tree/{tree_path}
    S3-->>FetchBlob: raw content
    FetchBlob-->>UI: BlobContent (content, content_type)
    UI->>UI: render blob in documents section
    UI-->>User: rendered document
```
"""
