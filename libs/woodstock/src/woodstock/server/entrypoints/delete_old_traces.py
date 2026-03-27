import argparse
import logging

import duckdb

from woodstock.server.actions.delete_old_traces import DeleteOldTracesForm, delete_old_traces
from woodstock.server.models.index_state import IndexState
from woodstock.settings import WOODSTOCK_DUCKDB_PATH
from woodstock.storage.rules.get_file_storage import get_file_storage

logger = logging.getLogger(__name__)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="delete-old-traces")
    parser.add_argument(
        "--retention-days",
        type=int,
        required=True,
        help="Delete traces older than this many days",
    )
    return parser.parse_args()


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    file_storage = get_file_storage()
    conn = duckdb.connect(WOODSTOCK_DUCKDB_PATH)
    index_state = IndexState(conn=conn)

    delete_old_traces(
        DeleteOldTracesForm(retention_days=args.retention_days),
        file_storage,
        index_state,
    )
    logger.info("Deleted traces older than %d days", args.retention_days)
