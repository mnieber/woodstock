import json
import logging
import typing as T
from datetime import datetime, timezone

from dataclassy import dataclass
from woodstock.storage.models.file_storage import FileStorage
from woodstock.trace.actions.upload_blob import upload_blob
from woodstock.trace.enums import TraceState
from woodstock.trace.models.blob import Blob
from woodstock.trace.models.trace_record import TraceRecord
from woodstock.trace.utils.uuid7 import uuid7

logger = logging.getLogger(__name__)


@dataclass
class WriteTraceForm:
    trace_key: str
    author: str
    trace_state: TraceState
    payload: dict
    blobs: T.List[Blob] = []
    label_patch: T.Dict[str, T.Dict[str, T.Any]] = {}


def write_trace(form: WriteTraceForm, file_storage: FileStorage) -> TraceRecord:
    # Upload blobs and insert tree:// references into a copy of the payload
    payload = dict(form.payload)
    for blob in form.blobs:
        tree_path = upload_blob(form.trace_key, blob, file_storage)
        payload[blob.name] = f"tree://{tree_path}"

    # Build the trace record
    record = TraceRecord(
        trace_key=form.trace_key,
        trace_state=form.trace_state,
        author=form.author,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        payload=payload,
        labels=form.label_patch,
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
            "labels": record.labels,
        }
    ).encode()
    logger.info("Writing trace record to %s", path)
    file_storage.put_file(path, content)

    return record
