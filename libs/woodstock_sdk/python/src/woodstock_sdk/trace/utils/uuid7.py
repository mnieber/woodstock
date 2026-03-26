import os
import struct
import time


def uuid7() -> str:
    # 48-bit millisecond timestamp, 12 random bits, 62 random bits, with version/variant bits set
    ms = int(time.time() * 1000)
    rand = int.from_bytes(os.urandom(10), "big")
    hi = (ms << 16) | 0x7000 | ((rand >> 62) & 0x0FFF)
    lo = 0x8000000000000000 | (rand & 0x3FFFFFFFFFFFFFFF)
    b = struct.pack(">QQ", hi, lo)
    return "%08x-%04x-%04x-%04x-%012x" % (
        int.from_bytes(b[0:4], "big"),
        int.from_bytes(b[4:6], "big"),
        int.from_bytes(b[6:8], "big"),
        int.from_bytes(b[8:10], "big"),
        int.from_bytes(b[10:16], "big"),
    )
