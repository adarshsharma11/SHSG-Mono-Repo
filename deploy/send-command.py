"""Transfer the reviewed deployment files and wait for their EC2 execution result."""

import base64
import io
import json
import os
import re
import shlex
import subprocess
import tarfile
import time
from pathlib import Path


def aws(*args):
    return subprocess.run(
        ["aws", *args, "--output", "json"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout


def main():
    revision = os.environ["GITHUB_SHA"]
    instance = os.environ["EC2_INSTANCE_ID"]
    registry = os.environ["IMAGE_REGISTRY"]
    region = os.environ["AWS_REGION"]
    if not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise ValueError("A full commit SHA is required")
    if not re.fullmatch(r"i-[0-9a-f]{8,17}", instance):
        raise ValueError("Set EC2_INSTANCE_ID to the instance ID, not its public IP")

    archive = io.BytesIO()
    with tarfile.open(fileobj=archive, mode="w:gz") as bundle:
        for name in ("compose.production.yml", "deploy.sh"):
            bundle.add(Path("deploy") / name, arcname=name)
    payload = base64.b64encode(archive.getvalue()).decode("ascii")
    release = f"/opt/shsg/releases/{revision}"
    command = "\n".join(
        [
            "set -eu",
            "umask 077",
            f"mkdir -p {shlex.quote(release)}",
            f"printf '%s' {shlex.quote(payload)} | base64 --decode | tar -xz -C {shlex.quote(release)}",
            shlex.join(
                [
                    "bash",
                    f"{release}/deploy.sh",
                    region,
                    registry,
                    revision,
                    os.environ.get("BACKUP_S3_URI", ""),
                ]
            ),
        ]
    )
    result = json.loads(
        aws(
            "ssm",
            "send-command",
            "--instance-ids",
            instance,
            "--document-name",
            "AWS-RunShellScript",
            "--timeout-seconds",
            "120",
            "--parameters",
            json.dumps({"commands": [command], "executionTimeout": ["1200"]}),
            "--comment",
            f"SHSG deployment {revision}",
        )
    )
    command_id = result["Command"]["CommandId"]
    print(f"SSM command: {command_id}", flush=True)
    # Run Command is eventually consistent. Only retry the expected initial absence.
    for _ in range(260):
        try:
            invocation = json.loads(
                aws(
                    "ssm",
                    "get-command-invocation",
                    "--command-id",
                    command_id,
                    "--instance-id",
                    instance,
                )
            )
        except subprocess.CalledProcessError as error:
            if "InvocationDoesNotExist" not in error.stderr:
                raise
            time.sleep(5)
            continue
        status = invocation["Status"]
        if status not in {"Pending", "InProgress", "Delayed", "Cancelling"}:
            print(invocation.get("StandardOutputContent", ""))
            print(invocation.get("StandardErrorContent", ""))
            if status != "Success" or invocation.get("ResponseCode") != 0:
                raise RuntimeError(f"Deployment failed: {status}")
            return
        time.sleep(5)
    raise TimeoutError(
        f"Deployment status timed out; inspect SSM command {command_id} before retrying"
    )


if __name__ == "__main__":
    main()
