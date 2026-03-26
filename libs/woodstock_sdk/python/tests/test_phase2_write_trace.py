import json
from pathlib import Path

import pytest
from woodstock_sdk.storage.models.local_fs_file_storage import LocalFsFileStorage
from woodstock_sdk.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock_sdk.trace.enums import TraceState


@pytest.fixture
def storage(tmp_path):
    return LocalFsFileStorage(base_path=tmp_path)


def test_write_trace_creates_file(storage, tmp_path):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_started",
        author="calcium",
        trace_state=TraceState.OK,
        payload={"status": "value://started"},
    )
    record = write_trace(form, storage)

    files = storage.list_files("traces/")
    assert len(files) == 1

    content = json.loads(storage.get_file(files[0]))
    assert content["trace_key"] == "job-123/calc-456/calculation_started"
    assert content["trace_state"] == TraceState.OK
    assert content["payload"] == {"status": "value://started"}
    assert "timestamp" in content


def test_write_trace_returns_record(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_failed",
        author="calcium",
        trace_state=TraceState.ERROR,
        payload={"severity": "value://high"},
    )
    record = write_trace(form, storage)

    assert record.trace_key == "job-123/calc-456/calculation_failed"
    assert record.trace_state == TraceState.ERROR
    assert record.payload == {"severity": "value://high"}


def test_write_trace_files_are_lexicographically_ordered(storage):
    for state in [TraceState.OK, TraceState.WARNING, TraceState.ERROR]:
        form = WriteTraceForm(
            trace_key=f"job-1/node/{state}",
            author="calcium",
            trace_state=state,
            payload={},
        )
        write_trace(form, storage)

    files = storage.list_files("traces/")
    assert files == sorted(files)
