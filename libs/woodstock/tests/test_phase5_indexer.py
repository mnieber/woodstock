import duckdb
import pytest
from woodstock.server.actions.poll_trace_log import PollTraceLogForm, poll_trace_log
from woodstock.server.models.index_state import IndexState
from woodstock.storage.models.local_fs_file_storage import LocalFsFileStorage
from woodstock.trace.actions.write_trace import WriteTraceForm, write_trace
from woodstock.trace.enums import TraceState


@pytest.fixture
def storage(tmp_path):
    return LocalFsFileStorage(base_path=tmp_path)


@pytest.fixture
def index_state():
    return IndexState(conn=duckdb.connect())


def test_poll_indexes_written_traces(storage, index_state):
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

    poll_trace_log(PollTraceLogForm(), storage, index_state)

    rows = index_state.conn.execute("SELECT trace_key, trace_state FROM traces ORDER BY uuidv7").fetchall()
    assert rows == [
        ("job-1/calc-1/started", TraceState.OK.value),
        ("job-1/calc-1/finished", TraceState.OK.value),
    ]


def test_poll_is_incremental(storage, index_state):
    write_trace(WriteTraceForm(
        trace_key="job-2/step-1/done",
        author="bob",
        trace_state=TraceState.OK,
        payload={},
    ), storage)

    poll_trace_log(PollTraceLogForm(), storage, index_state)

    write_trace(WriteTraceForm(
        trace_key="job-2/step-2/done",
        author="bob",
        trace_state=TraceState.WARNING,
        payload={},
    ), storage)

    poll_trace_log(PollTraceLogForm(), storage, index_state)

    rows = index_state.conn.execute("SELECT trace_key FROM traces ORDER BY uuidv7").fetchall()
    assert rows == [("job-2/step-1/done",), ("job-2/step-2/done",)]


def test_poll_with_no_new_entries_is_noop(storage, index_state):
    poll_trace_log(PollTraceLogForm(), storage, index_state)

    count = index_state.conn.execute(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'traces'"
    ).fetchone()[0]
    assert count == 0


def test_poll_resumes_after_restart(storage, tmp_path):
    write_trace(WriteTraceForm(
        trace_key="job-4/step-1/done",
        author="dave",
        trace_state=TraceState.OK,
        payload={},
    ), storage)

    db_path = str(tmp_path / "index.duckdb")
    index_state = IndexState(conn=duckdb.connect(db_path))
    poll_trace_log(PollTraceLogForm(), storage, index_state)
    index_state.conn.close()

    write_trace(WriteTraceForm(
        trace_key="job-4/step-2/done",
        author="dave",
        trace_state=TraceState.OK,
        payload={},
    ), storage)

    # Simulate restart by opening a new connection to the same db file
    index_state = IndexState(conn=duckdb.connect(db_path))
    poll_trace_log(PollTraceLogForm(), storage, index_state)

    rows = index_state.conn.execute("SELECT trace_key FROM traces ORDER BY uuidv7").fetchall()
    assert rows == [("job-4/step-1/done",), ("job-4/step-2/done",)]


def test_poll_indexes_labels(storage, index_state):
    write_trace(WriteTraceForm(
        trace_key="job-3/calc-1/started",
        author="carol",
        trace_state=TraceState.OK,
        payload={},
        label_patch={"job-3": {"active": True}},
    ), storage)

    poll_trace_log(PollTraceLogForm(), storage, index_state)

    row = index_state.conn.execute("SELECT labels FROM traces").fetchone()
    assert row is not None
