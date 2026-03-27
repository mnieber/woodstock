import pytest
from conftest import just
from woodstock.storage.models.s3_file_storage import S3FileStorage
from woodstock.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock.trace.enums import TraceState


BUCKET = "woodstock-test"


@pytest.fixture(autouse=True)
def wipe_state():
    storage = S3FileStorage(bucket_name=BUCKET)
    paths = storage.list_files("")
    if paths:
        storage.delete_files(paths)
    just("wipe-db")


def test_indexer_runs_without_error():
    storage = S3FileStorage(bucket_name=BUCKET)

    write_trace(WriteTraceForm(
        trace_key="job-1/calc-1/started",
        author="alice",
        trace_state=TraceState.OK,
        payload={"status": "value://started"},
    ), storage)
    write_trace(WriteTraceForm(
        trace_key="job-1/calc-1/finished",
        author="alice",
        trace_state=TraceState.OK,
        payload={},
    ), storage)

    just("run-indexer")

    trace_files = storage.list_files("traces/")
    assert len(trace_files) == 2
