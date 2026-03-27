import json
import typing as T

from dataclassy import dataclass

from woodstock.server.models.index_state import IndexState
from woodstock.server.models.trace_list import TraceList
from woodstock.trace.models.trace_record import TraceRecord


@dataclass
class QueryTracesForm:
    trace_key_prefix: T.Optional[str] = None
    trace_state: T.Optional[str] = None
    author: T.Optional[str] = None
    time_range_start: T.Optional[str] = None
    time_range_end: T.Optional[str] = None


def query_traces(form: QueryTracesForm, index_state: IndexState) -> TraceList:
    conditions = []
    params = []

    if form.trace_key_prefix:
        conditions.append("trace_key LIKE ?")
        params.append(form.trace_key_prefix + "%")
    if form.trace_state:
        conditions.append("trace_state = ?")
        params.append(form.trace_state)
    if form.author:
        conditions.append("author = ?")
        params.append(form.author)
    if form.time_range_start:
        conditions.append("timestamp >= ?")
        params.append(form.time_range_start)
    if form.time_range_end:
        conditions.append("timestamp <= ?")
        params.append(form.time_range_end)

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    sql = f"SELECT trace_key, trace_state, author, timestamp, payload, labels FROM traces {where} ORDER BY timestamp"

    rows = index_state.conn.execute(sql, params).fetchall()

    items = [
        TraceRecord(
            trace_key=row[0],
            trace_state=row[1],
            author=row[2],
            timestamp=row[3],
            payload=json.loads(row[4]) if row[4] else {},
            labels=json.loads(row[5]) if row[5] else {},
        )
        for row in rows
    ]
    return TraceList(items=items)
