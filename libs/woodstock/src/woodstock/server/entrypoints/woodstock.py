import argparse
import datetime
import logging
import sqlite3
import time

import bottle

from woodstock.server.actions.delete_old_traces import (
    DeleteOldTracesForm,
    delete_old_traces,
)
from woodstock.server.actions.poll_trace_log import PollTraceLogForm, poll_trace_log
from woodstock.server.actions.upsert_trace import UpsertTraceForm, upsert_trace
from woodstock.server.api_views.api_views import app
from woodstock.server.models.index_state import IndexState
from woodstock.settings import WOODSTOCK_DB_PATH, WOODSTOCK_POLL_INTERVAL_SECONDS
from woodstock.storage.rules.get_file_storage import get_file_storage
from woodstock.trace.enums import TraceStates
from woodstock.trace.models.trace_record import TraceRecord
from woodstock.trace.utils.uuid7 import uuid7

logger = logging.getLogger(__name__)


def _open_db(read_only: bool = False) -> sqlite3.Connection:
    conn = sqlite3.connect(WOODSTOCK_DB_PATH, check_same_thread=False, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    if read_only:
        conn.execute("PRAGMA query_only=ON")
    else:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS traces (
                uuidv7       TEXT PRIMARY KEY,
                trace_key    TEXT,
                trace_state  TEXT,
                author       TEXT,
                timestamp    TEXT,
                payload      TEXT,
                labels       TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS index_meta (
                key    TEXT PRIMARY KEY,
                value  TEXT
            )
            """
        )
        conn.commit()
    return conn


def _run_indexer(args: argparse.Namespace) -> None:
    file_storage = get_file_storage()
    index_state = IndexState(conn=_open_db())

    while True:
        poll_trace_log(PollTraceLogForm(), file_storage, index_state)
        if args.no_loop:
            break
        time.sleep(WOODSTOCK_POLL_INTERVAL_SECONDS)


def _run_server(args: argparse.Namespace) -> None:
    file_storage = get_file_storage()
    index_state = IndexState(conn=_open_db())
    upsert_trace(
        UpsertTraceForm(
            trace_record=TraceRecord(
                trace_key="woodstock/server/started",
                trace_state=TraceStates.OK,
                author="woodstock-server",
                timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
            uuidv7=uuid7(),
        ),
        index_state,
    )
    app.config["file_storage"] = file_storage
    app.config["index_state"] = index_state
    bottle.run(app, host=args.host, port=args.port)


def _delete_old_traces(args: argparse.Namespace) -> None:
    file_storage = get_file_storage()
    index_state = IndexState(conn=_open_db())
    delete_old_traces(
        DeleteOldTracesForm(older_than_timestamp=args.older_than_timestamp),
        file_storage,
        index_state,
    )
    logger.info("Deleted traces older than %s", args.older_than_timestamp)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(prog="woodstock")
    sub = parser.add_subparsers(dest="command", required=True)

    p_indexer = sub.add_parser(
        "run-indexer", help="Poll the trace log and update the DuckDB index"
    )
    p_indexer.add_argument(
        "--no-loop",
        action="store_true",
        help="Poll once and exit instead of running on an interval",
    )

    p_server = sub.add_parser("run-server", help="Start the HTTP server")
    p_server.add_argument("--host", default="0.0.0.0")
    p_server.add_argument("--port", type=int, default=8080)

    p_delete = sub.add_parser(
        "delete-old-traces", help="Delete traces older than a given ISO-8601 timestamp"
    )
    p_delete.add_argument(
        "--older-than-timestamp",
        required=True,
        help="Delete traces with a timestamp older than this ISO-8601 datetime",
    )

    return parser.parse_args()


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    if args.command == "run-indexer":
        _run_indexer(args)
    elif args.command == "run-server":
        _run_server(args)
    elif args.command == "delete-old-traces":
        _delete_old_traces(args)
