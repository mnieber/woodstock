import json
import logging

from dataclassy import dataclass

from woodstock.server.models.index_state import IndexState
from woodstock.trace.models.trace_record import TraceRecord

logger = logging.getLogger(__name__)


@dataclass
class UpsertTraceForm:
    trace_record: TraceRecord
    uuidv7: str


def upsert_trace(form: UpsertTraceForm, index_state: IndexState) -> None:
    conn = index_state.conn
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
    conn.execute(
        """
        INSERT INTO traces (uuidv7, trace_key, trace_state, author, timestamp, payload, labels)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (uuidv7) DO UPDATE SET
            trace_key   = excluded.trace_key,
            trace_state = excluded.trace_state,
            author      = excluded.author,
            timestamp   = excluded.timestamp,
            payload     = excluded.payload,
            labels      = excluded.labels
        """,
        (
            form.uuidv7,
            form.trace_record.trace_key,
            form.trace_record.trace_state,
            form.trace_record.author,
            form.trace_record.timestamp,
            json.dumps(form.trace_record.payload),
            json.dumps(form.trace_record.labels),
        ),
    )
    conn.execute(
        """
        INSERT INTO index_meta (key, value) VALUES ('last_seen_key', ?)
        ON CONFLICT (key) DO UPDATE SET value = excluded.value
        """,
        (f"traces/{form.uuidv7}.json",),
    )
    conn.commit()
    logger.info("Upserted trace %s into index", form.uuidv7)
