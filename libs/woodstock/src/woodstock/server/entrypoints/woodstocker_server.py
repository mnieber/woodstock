import argparse
import json
import logging

import bottle
import duckdb

from woodstock.server.actions.fetch_blob import FetchBlobForm, fetch_blob
from woodstock.server.actions.query_traces import QueryTracesForm, query_traces
from woodstock.server.models.index_state import IndexState
from woodstock.settings import WOODSTOCK_DUCKDB_PATH
from woodstock.storage.rules.get_file_storage import get_file_storage

logger = logging.getLogger(__name__)

app = bottle.Bottle()
_index_state: IndexState = None
_file_storage = None


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="woodstock-server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8080)
    return parser.parse_args()


@app.route("/query-traces")
def handle_query_traces():
    form = QueryTracesForm(
        trace_key_prefix=bottle.request.query.get("trace_key_prefix") or None,
        trace_state=bottle.request.query.get("trace_state") or None,
        author=bottle.request.query.get("author") or None,
        time_range_start=bottle.request.query.get("time_range_start") or None,
        time_range_end=bottle.request.query.get("time_range_end") or None,
    )
    trace_list = query_traces(form, _index_state)
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
    tree_path = bottle.request.query.get("tree_path")
    if not tree_path:
        bottle.abort(400, "tree_path is required")
    form = FetchBlobForm(tree_path=tree_path)
    blob = fetch_blob(form, _file_storage)
    bottle.response.content_type = "application/octet-stream"
    return blob.content


def main() -> None:
    global _index_state, _file_storage
    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    _file_storage = get_file_storage()
    conn = duckdb.connect(WOODSTOCK_DUCKDB_PATH, read_only=True)
    _index_state = IndexState(conn=conn)

    bottle.run(app, host=args.host, port=args.port)
