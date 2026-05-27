import json
import re

import bottle

from woodstock.server.actions.delete_old_traces import DeleteOldTracesForm, delete_old_traces
from woodstock.server.actions.fetch_blob import FetchBlobForm, fetch_blob
from woodstock.server.actions.query_traces import QueryTracesForm, query_traces
from woodstock.server.models.index_state import IndexState
from woodstock.storage.models.file_storage import FileStorage

app = bottle.Bottle()

_LOCALHOST_ORIGIN = re.compile(r'^https?://localhost(:\d+)?$')


def _add_cors_headers():
    origin = bottle.request.environ.get('HTTP_ORIGIN', '')
    if _LOCALHOST_ORIGIN.match(origin):
        bottle.response.set_header('Access-Control-Allow-Origin', origin)
        bottle.response.set_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        bottle.response.set_header('Access-Control-Allow-Headers', 'Content-Type')


@app.hook('after_request')
def apply_cors():
    _add_cors_headers()


@app.route('/<:path>', method='OPTIONS')
def handle_options(*args, **kwargs):
    _add_cors_headers()
    return {}


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


@app.route("/delete-old-traces", method="POST")
def handle_delete_old_traces():
    file_storage = bottle.request.app.config["file_storage"]
    index_state = bottle.request.app.config["index_state"]
    body = bottle.request.json or {}
    older_than_timestamp = body.get("older_than_timestamp")
    if not older_than_timestamp:
        bottle.abort(400, "older_than_timestamp is required")
    form = DeleteOldTracesForm(older_than_timestamp=older_than_timestamp)
    delete_old_traces(form, file_storage, index_state)
    bottle.response.content_type = "application/json"
    return json.dumps({"ok": True})


@app.route("/fetch-blob")
def handle_fetch_blob():
    file_storage = bottle.request.app.config["file_storage"]
    tree_path = bottle.request.query.get("tree_path")
    if not tree_path:
        bottle.abort(400, "tree_path is required")
    blob = fetch_blob(FetchBlobForm(tree_path=tree_path), file_storage)
    bottle.response.content_type = "application/octet-stream"
    return blob.content
