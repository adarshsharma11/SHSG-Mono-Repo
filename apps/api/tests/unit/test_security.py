import uuid

import jwt

from shsg_api.core.security import ALGORITHM, create_access_token, hash_password, verify_password
from shsg_api.core.settings import Settings


def test_passwords_are_hashed_with_argon2_and_verified() -> None:
    encoded = hash_password("correct-horse-battery-staple")

    assert encoded.startswith("$argon2")
    assert verify_password("correct-horse-battery-staple", encoded)
    assert not verify_password("incorrect-password", encoded)


def test_access_token_has_user_subject_and_expiration() -> None:
    user_id = uuid.uuid4()
    secret = "test-secret-that-is-at-least-32-characters-long"
    settings = Settings(auth_jwt_secret=secret, auth_access_token_minutes=30)

    encoded, expires_in = create_access_token(user_id, settings)
    payload = jwt.decode(encoded, secret, algorithms=[ALGORITHM])

    assert payload["sub"] == f"user:{user_id}"
    assert payload["exp"] > payload["iat"]
    assert expires_in == 1800
