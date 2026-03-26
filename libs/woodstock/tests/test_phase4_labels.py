import json

import pytest
from woodstock.storage.models.local_fs_file_storage import LocalFsFileStorage
from woodstock.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock.trace.enums import TraceState


@pytest.fixture
def storage(tmp_path):
    return LocalFsFileStorage(base_path=tmp_path)


def _read_record(storage):
    files = storage.list_files("traces/")
    return json.loads(storage.get_file(files[0]))


def test_labels_are_written_to_trace_record(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_started",
        author="calcium",
        trace_state=TraceState.OK,
        payload={"status": "value://started"},
        label_patch={
            "job-123": {"active": True},
            "job-123/calc-456": {"active": True},
        },
    )
    write_trace(form, storage)

    record = _read_record(storage)
    assert record["labels"] == {
        "job-123": {"active": True},
        "job-123/calc-456": {"active": True},
    }


def test_null_label_value_is_written(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_finished",
        author="calcium",
        trace_state=TraceState.OK,
        payload={},
        label_patch={"job-123/calc-456": {"active": None}},
    )
    write_trace(form, storage)

    record = _read_record(storage)
    assert record["labels"]["job-123/calc-456"]["active"] is None


def test_labels_default_to_empty(storage):
    form = WriteTraceForm(
        trace_key="job-123/calc-456/calculation_started",
        author="calcium",
        trace_state=TraceState.OK,
        payload={},
    )
    write_trace(form, storage)

    record = _read_record(storage)
    assert record["labels"] == {}
