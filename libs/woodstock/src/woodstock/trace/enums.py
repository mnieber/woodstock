from enum import Enum


class TraceStates(str, Enum):
    OK = "ok"
    WARNING = "warning"
    ERROR = "error"
