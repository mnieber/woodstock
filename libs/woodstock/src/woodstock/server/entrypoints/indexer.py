import argparse
import logging
import time

import duckdb

from woodstock.server.actions.poll_trace_log import PollTraceLogForm, poll_trace_log
from woodstock.server.models.index_state import IndexState
from woodstock.settings import WOODSTOCK_DUCKDB_PATH, WOODSTOCK_POLL_INTERVAL_SECONDS
from woodstock.storage.rules.get_file_storage import get_file_storage

logger = logging.getLogger(__name__)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="woodstock indexer")
    parser.add_argument(
        "--no-loop",
        action="store_true",
        help="Poll once and exit instead of running on an interval",
    )
    return parser.parse_args()


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    file_storage = get_file_storage()

    conn = duckdb.connect(WOODSTOCK_DUCKDB_PATH)
    index_state = IndexState(conn=conn)

    while True:
        poll_trace_log(PollTraceLogForm(), file_storage, index_state)
        if args.no_loop:
            break
        time.sleep(WOODSTOCK_POLL_INTERVAL_SECONDS)
