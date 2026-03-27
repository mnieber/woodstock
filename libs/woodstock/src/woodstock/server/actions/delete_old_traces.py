from dataclassy import dataclass

from woodstock.server.models.index_state import IndexState
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

    trace_log_paths = [f"traces/{uuidv7}.json" for uuidv7, _ in rows]
    file_storage.delete_files(trace_log_paths)

    tree_prefixes = {trace_key for _, trace_key in rows}
    tree_paths = []
    for prefix in tree_prefixes:
        tree_paths.extend(file_storage.list_files(f"tree/{prefix}"))
    if tree_paths:
        file_storage.delete_files(tree_paths)

    uuidv7s = [uuidv7 for uuidv7, _ in rows]
    placeholders = ", ".join("?" * len(uuidv7s))
    index_state.conn.execute(
        f"DELETE FROM traces WHERE uuidv7 IN ({placeholders})", uuidv7s
    )
