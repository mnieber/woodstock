import json
import logging
from datetime import datetime, timezone

from dataclassy import dataclass
from woodstock_sdk.storage.models.file_storage import FileStorage
from woodstock_sdk.trace.enums import TraceState
from woodstock_sdk.trace.models.trace_record import TraceRecord
from woodstock_sdk.trace.utils.uuid7 import uuid7

logger = logging.getLogger(__name__)


@dataclass
class WriteTraceForm:
    trace_key: str
    author: str
    trace_state: TraceState
    payload: dict


def write_trace(form: WriteTraceForm, file_storage: FileStorage) -> TraceRecord:
    # Build the trace record
    record = TraceRecord(
        trace_key=form.trace_key,
        trace_state=form.trace_state,
        author=form.author,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        payload=form.payload,
    )

    # Write the record to the trace log
    uuidv7 = uuid7()
    path = f"traces/{uuidv7}.json"
    content = json.dumps(
        {
            "trace_key": record.trace_key,
            "trace_state": record.trace_state,
            "author": record.author,
            "timestamp": record.timestamp,
            "payload": record.payload,
        }
    ).encode()
    logger.info("Writing trace record to %s", path)
    file_storage.put_file(path, content)

    return record
