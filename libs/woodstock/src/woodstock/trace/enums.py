from enum import Enum


class TraceState(str, Enum):
    OK = "ok"
    WARNING = "warning"
    ERROR = "error"
