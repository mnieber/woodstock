import typing as T

from dataclassy import dataclass

from woodstock.trace.enums import TraceStates


@dataclass
class TraceRecord:
    trace_key: str
    trace_state: TraceStates
    author: str
    timestamp: str
    payload: T.Dict[str, str] = {}
    labels: T.Dict[str, T.Dict[str, T.Any]] = {}
