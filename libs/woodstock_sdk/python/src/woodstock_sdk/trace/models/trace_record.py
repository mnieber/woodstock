import typing as T

from dataclassy import dataclass

from woodstock_sdk.trace.enums import TraceState


@dataclass
class TraceRecord:
    trace_key: str
    trace_state: TraceState
    author: str
    timestamp: str
    payload: T.Dict[str, str] = {}
    labels: T.Dict[str, T.Dict[str, T.Any]] = {}
