"""Exercise the actual production containers, including the Next.js API proxy.

For an isolated CI database only: this creates a test account.
"""

import json
import os
from urllib.request import Request, urlopen
from uuid import uuid4

WEBSITE_URL = os.environ.get("SMOKE_WEBSITE_URL", "http://127.0.0.1:9001")
APP_URL = os.environ.get("SMOKE_APP_URL", "http://127.0.0.1:9002")


def get(url):
    with urlopen(url, timeout=15) as response:
        assert response.status == 200, url
        return response.read().decode()


def post(path, payload):
    request = Request(
        f"{APP_URL}{path}",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=15) as response:
        assert response.status in {200, 201}, path
        return json.load(response)


def main():
    home = get(f"{WEBSITE_URL}/")
    assert "http://15.134.206.246:9002" in home, (
        "Website links must target the deployed app"
    )
    get(f"{APP_URL}/login")
    get(f"{APP_URL}/signup")
    get(f"{WEBSITE_URL}/api/health")
    get(f"{APP_URL}/api/health")
    email = f"smoke-{uuid4().hex}@example.com"
    password = "CI-only-strong-password-2026!"
    post(
        "/api/auth/signup",
        {
            "full_name": "CI Smoke Test",
            "email": email,
            "phone": "+61412345678",
            "password": password,
        },
    )
    login = post("/api/auth/login", {"email": email, "password": password})
    assert login["data"]["access_token"], "Login must return a bearer token"
    assert login["data"]["user"]["email"] == email
    print("Production pages, backend proxy, signup and login passed")


if __name__ == "__main__":
    main()
