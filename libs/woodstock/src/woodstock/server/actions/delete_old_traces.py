from dataclassy import dataclass

from woodstock.server.models.index_state import IndexState
from woodstock.storage.actions.delete_traces import DeleteTracesForm, delete_traces
from woodstock.storage.models.file_storage import FileStorage


@dataclass
class DeleteOldTracesForm:
    retention_days: int


def delete_old_traces(
    form: DeleteOldTracesForm,
    file_storage: FileStorage,
    index_state: IndexState,
) -> None:
    cutoff = f"now() - INTERVAL {form.retention_days} DAYS"
    rows = index_state.conn.execute(
        f"SELECT uuidv7, trace_key FROM traces WHERE CAST(timestamp AS TIMESTAMP) < {cutoff}"
    ).fetchall()

    if not rows:
        return

    uuidv7s = [uuidv7 for uuidv7, _ in rows]
    trace_keys = [trace_key for _, trace_key in rows]
    delete_traces(DeleteTracesForm(uuidv7s=uuidv7s, trace_keys=trace_keys), file_storage)

    placeholders = ", ".join("?" * len(uuidv7s))
    index_state.conn.execute(
        f"DELETE FROM traces WHERE uuidv7 IN ({placeholders})", uuidv7s
    )
