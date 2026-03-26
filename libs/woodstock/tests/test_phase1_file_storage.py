import pytest
from pathlib import Path
from woodstock.storage.models.local_fs_file_storage import LocalFsFileStorage


@pytest.fixture
def storage(tmp_path):
    return LocalFsFileStorage(base_path=tmp_path)


def test_put_and_get_file(storage):
    storage.put_file("traces/abc.json", b'{"hello": "world"}')
    assert storage.get_file("traces/abc.json") == b'{"hello": "world"}'


def test_list_files_returns_sorted(storage):
    storage.put_file("traces/b.json", b"b")
    storage.put_file("traces/a.json", b"a")
    storage.put_file("traces/c.json", b"c")
    assert storage.list_files("traces/") == [
        "traces/a.json",
        "traces/b.json",
        "traces/c.json",
    ]


def test_list_files_start_after(storage):
    storage.put_file("traces/a.json", b"a")
    storage.put_file("traces/b.json", b"b")
    storage.put_file("traces/c.json", b"c")
    result = storage.list_files("traces/", start_after="traces/a.json")
    assert result == ["traces/b.json", "traces/c.json"]


def test_list_files_empty_prefix(storage):
    assert storage.list_files("traces/") == []


def test_delete_files(storage):
    storage.put_file("traces/a.json", b"a")
    storage.put_file("traces/b.json", b"b")
    storage.delete_files(["traces/a.json"])
    assert storage.list_files("traces/") == ["traces/b.json"]


def test_delete_files_nonexistent_is_noop(storage):
    storage.delete_files(["traces/does_not_exist.json"])
