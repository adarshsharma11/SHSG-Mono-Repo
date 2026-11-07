import importlib.util
import json
import os
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "send_command", Path(__file__).with_name("send-command.py")
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class DeploymentCommandTests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(
            os.environ,
            {
                "GITHUB_SHA": "a" * 40,
                "EC2_INSTANCE_ID": "i-0123456789abcdef0",
                "IMAGE_REGISTRY": "123456789012.dkr.ecr.ap-southeast-2.amazonaws.com",
                "AWS_REGION": "ap-southeast-2",
            },
        )
        self.environment.start()
        self.addCleanup(self.environment.stop)

    @patch.object(module.time, "sleep")
    @patch.object(module, "aws")
    def test_waits_for_success_and_targets_exact_release(self, aws, sleep):
        missing = subprocess.CalledProcessError(
            1, "aws", stderr="InvocationDoesNotExist"
        )
        aws.side_effect = [
            json.dumps({"Command": {"CommandId": "command-1"}}),
            missing,
            json.dumps({"Status": "InProgress"}),
            json.dumps({"Status": "Success", "ResponseCode": 0}),
        ]
        module.main()
        request = aws.call_args_list[0].args
        self.assertEqual(
            request[request.index("--instance-ids") + 1], "i-0123456789abcdef0"
        )
        parameters = json.loads(request[request.index("--parameters") + 1])
        self.assertIn("/opt/shsg/releases/" + "a" * 40, parameters["commands"][0])
        self.assertEqual(sleep.call_count, 2)

    @patch.object(module, "aws")
    def test_remote_failure_fails_the_deployment(self, aws):
        aws.side_effect = [
            json.dumps({"Command": {"CommandId": "command-1"}}),
            json.dumps({"Status": "Failed", "ResponseCode": 1}),
        ]
        with self.assertRaisesRegex(RuntimeError, "Deployment failed"):
            module.main()

    @patch.object(module, "aws")
    def test_public_ip_is_not_accepted_as_instance_id(self, aws):
        os.environ["EC2_INSTANCE_ID"] = "15.134.206.246"
        with self.assertRaisesRegex(ValueError, "instance ID"):
            module.main()
        aws.assert_not_called()

    @patch.object(module, "aws")
    def test_aws_permission_failures_are_not_silently_retried(self, aws):
        aws.side_effect = [
            json.dumps({"Command": {"CommandId": "command-1"}}),
            subprocess.CalledProcessError(1, "aws", stderr="AccessDenied"),
        ]
        with self.assertRaises(subprocess.CalledProcessError):
            module.main()


if __name__ == "__main__":
    unittest.main()
