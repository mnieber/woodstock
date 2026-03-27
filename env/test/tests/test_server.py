import time

import pytest
import requests
from conftest import just
from woodstock.storage.models.s3_file_storage import S3FileStorage
from woodstock.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock.trace.enums import TraceState


BUCKET = "woodstock-test"
SERVER_URL = "http://localhost:8080"


@pytest.fixture(autouse=True)
def wipe_bucket():
    storage = S3FileStorage(bucket_name=BUCKET)
    paths = storage.list_files("")
    if paths:
        storage.delete_files(paths)


@pytest.fixture()
def server():
    just("start-server")
    # Wait for the server to be ready
    for _ in range(20):
        try:
            requests.get(f"{SERVER_URL}/query-traces", timeout=1)
            break
        except Exception:
            time.sleep(1)
    yield
    just("stop-server")


def test_query_traces_returns_indexed_traces(server):
    storage = S3FileStorage(bucket_name=BUCKET)

    write_trace(WriteTraceForm(
        trace_key="job-1/step-1",
        author="alice",
        trace_state=TraceState.OK,
        payload={"status": "value://done"},
    ), storage)
    write_trace(WriteTraceForm(
        trace_key="job-1/step-2",
        author="bob",
        trace_state=TraceState.ERROR,
        payload={},
    ), storage)

    just("run-indexer")

    response = requests.get(f"{SERVER_URL}/query-traces")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    trace_keys = {item["trace_key"] for item in data["items"]}
    assert trace_keys == {"job-1/step-1", "job-1/step-2"}


def test_query_traces_filters_by_prefix(server):
    storage = S3FileStorage(bucket_name=BUCKET)

    write_trace(WriteTraceForm(
        trace_key="job-1/step-1",
        author="alice",
        trace_state=TraceState.OK,
        payload={},
    ), storage)
    write_trace(WriteTraceForm(
        trace_key="job-2/step-1",
        author="alice",
        trace_state=TraceState.OK,
        payload={},
    ), storage)

    just("run-indexer")

    response = requests.get(f"{SERVER_URL}/query-traces", params={"trace_key_prefix": "job-1"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["trace_key"] == "job-1/step-1"
