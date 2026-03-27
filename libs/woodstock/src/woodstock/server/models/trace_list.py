import typing as T

from dataclassy import dataclass

from woodstock.trace.models.trace_record import TraceRecord


@dataclass
class TraceList:
    items: T.List[TraceRecord] = []
