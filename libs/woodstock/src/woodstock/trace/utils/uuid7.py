import os
import struct
import time

_last_ms: int = 0
_seq: int = 0


def uuid7() -> str:
    global _last_ms, _seq

    ms = int(time.time() * 1000)
    if ms <= _last_ms:
        _seq += 1
        ms = _last_ms
    else:
        _seq = 0
        _last_ms = ms

    # 48-bit ms timestamp | version nibble (7) | 12-bit sequence, then 62 random bits with variant
    rand = int.from_bytes(os.urandom(8), "big")
    hi = (ms << 16) | 0x7000 | (_seq & 0x0FFF)
    lo = 0x8000000000000000 | (rand & 0x3FFFFFFFFFFFFFFF)
    b = struct.pack(">QQ", hi, lo)
    return "%08x-%04x-%04x-%04x-%012x" % (
        int.from_bytes(b[0:4], "big"),
        int.from_bytes(b[4:6], "big"),
        int.from_bytes(b[6:8], "big"),
        int.from_bytes(b[8:10], "big"),
        int.from_bytes(b[10:16], "big"),
    )
