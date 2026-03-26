import json

import pytest
from woodstock.storage.models.local_fs_file_storage import LocalFsFileStorage
from woodstock.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock.trace.enums import TraceState
from woodstock.trace.models.blob import Blob


@pytest.fixture
def storage(tmp_path):
    return LocalFsFileStorage(base_path=tmp_path)


def test_blob_is_uploaded_to_tree(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_failed",
        author="calcium",
        trace_state=TraceState.ERROR,
        payload={"severity": "value://high"},
        blobs=[Blob(name="error.md", content=b"# Error\nDivision by zero")],
    )
    write_trace(form, storage)

    content = storage.get_file("tree/job-123/calc-456/calculation_failed/error.md")
    assert content == b"# Error\nDivision by zero"


def test_tree_ref_is_inserted_into_payload(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_failed",
        author="calcium",
        trace_state=TraceState.ERROR,
        payload={"severity": "value://high"},
        blobs=[Blob(name="error.md", content=b"# Error")],
    )
    write_trace(form, storage)

    files = storage.list_files("traces/")
    record = json.loads(storage.get_file(files[0]))
    assert (
        record["payload"]["error.md"]
        == "tree://job-123/calc-456/calculation_failed/error.md"
    )
    assert record["payload"]["severity"] == "value://high"


def test_multiple_blobs(storage):
    form = WriteTraceForm(
        trace_key="job-1/node/event",
        author="calcium",
        trace_state=TraceState.OK,
        payload={},
        blobs=[
            Blob(name="report.md", content=b"report"),
            Blob(name="data.json", content=b"{}"),
        ],
    )
    write_trace(form, storage)

    tree_files = storage.list_files("tree/")
    assert "tree/job-1/node/event/report.md" in tree_files
    assert "tree/job-1/node/event/data.json" in tree_files

    record = json.loads(storage.get_file(storage.list_files("traces/")[0]))
    assert record["payload"]["report.md"] == "tree://job-1/node/event/report.md"
    assert record["payload"]["data.json"] == "tree://job-1/node/event/data.json"


def test_original_payload_is_not_mutated(storage):
    original_payload = {"severity": "value://high"}
    form = WriteTraceForm(
        trace_key="job-1/node/event",
        author="calcium",
        trace_state=TraceState.OK,
        payload=original_payload,
        blobs=[Blob(name="report.md", content=b"report")],
    )
    write_trace(form, storage)

    assert original_payload == {"severity": "value://high"}
