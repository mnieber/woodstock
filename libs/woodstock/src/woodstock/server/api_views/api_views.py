import json

import bottle

from woodstock.server.actions.fetch_blob import FetchBlobForm, fetch_blob
from woodstock.server.actions.query_traces import QueryTracesForm, query_traces
from woodstock.server.models.index_state import IndexState
from woodstock.storage.models.file_storage import FileStorage

app = bottle.Bottle()


@app.route("/query-traces")
def handle_query_traces():
    index_state = bottle.request.app.config["index_state"]
    form = QueryTracesForm(
        trace_key_prefix=bottle.request.query.get("trace_key_prefix") or None,
        trace_state=bottle.request.query.get("trace_state") or None,
        author=bottle.request.query.get("author") or None,
        time_range_start=bottle.request.query.get("time_range_start") or None,
        time_range_end=bottle.request.query.get("time_range_end") or None,
    )
    trace_list = query_traces(form, index_state)
    bottle.response.content_type = "application/json"
    return json.dumps({
        "items": [
            {
                "trace_key": item.trace_key,
                "trace_state": item.trace_state,
                "author": item.author,
                "timestamp": item.timestamp,
                "payload": item.payload,
                "labels": item.labels,
            }
            for item in trace_list.items
        ]
    })


@app.route("/fetch-blob")
def handle_fetch_blob():
    file_storage = bottle.request.app.config["file_storage"]
    tree_path = bottle.request.query.get("tree_path")
    if not tree_path:
        bottle.abort(400, "tree_path is required")
    blob = fetch_blob(FetchBlobForm(tree_path=tree_path), file_storage)
    bottle.response.content_type = "application/octet-stream"
    return blob.content
