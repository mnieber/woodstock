import typing as T

from dataclassy import dataclass

from woodstock.storage.models.file_storage import FileStorage


@dataclass
class DeleteTracesForm:
    uuidv7s: T.List[str]
    trace_keys: T.List[str]


def delete_traces(form: DeleteTracesForm, file_storage: FileStorage) -> None:
    trace_log_paths = [f"traces/{uuidv7}.json" for uuidv7 in form.uuidv7s]
    file_storage.delete_files(trace_log_paths)

    tree_paths = []
    for trace_key in set(form.trace_keys):
        tree_paths.extend(file_storage.list_files(f"tree/{trace_key}"))
    if tree_paths:
        file_storage.delete_files(tree_paths)
