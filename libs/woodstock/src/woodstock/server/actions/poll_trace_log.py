import json
import logging

from dataclassy import dataclass

from woodstock.server.actions.upsert_trace import UpsertTraceForm, upsert_trace
from woodstock.server.models.index_state import IndexState
from woodstock.storage.models.file_storage import FileStorage
from woodstock.trace.models.trace_record import TraceRecord

logger = logging.getLogger(__name__)


@dataclass
class PollTraceLogForm:
    pass


def _get_last_seen_key(index_state: IndexState) -> str:
    try:
        row = index_state.conn.execute(
            "SELECT value FROM index_meta WHERE key = 'last_seen_key'"
        ).fetchone()
        return row[0] if row else ""
    except Exception:
        return ""


def poll_trace_log(form: PollTraceLogForm, file_storage: FileStorage, index_state: IndexState) -> None:
    last_seen_key = _get_last_seen_key(index_state)
    new_entries = file_storage.list_files("traces/", start_after=last_seen_key)
    logger.info("Found %d new trace log entries", len(new_entries))

    for path in new_entries:
        raw = file_storage.get_file(path)
        data = json.loads(raw)
        record = TraceRecord(
            trace_key=data["trace_key"],
            trace_state=data["trace_state"],
            author=data["author"],
            timestamp=data["timestamp"],
            payload=data.get("payload", {}),
            labels=data.get("labels", {}),
        )
        uuidv7 = path.removeprefix("traces/").removesuffix(".json")
        upsert_trace(UpsertTraceForm(trace_record=record, uuidv7=uuidv7), index_state)
