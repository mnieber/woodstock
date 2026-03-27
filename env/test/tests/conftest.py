import os
import subprocess


def just(*args):
    """Run a just recipe in the env/test justfile directory."""
    just_dir = os.environ["JUST_DIR"]
    result = subprocess.run(
        ["just", *args],
        cwd=just_dir,
        check=True,
    )
    return result
