import uuid
from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from shsg_api.core.settings import Settings

ALGORITHM = "HS256"
password_hash = PasswordHash.recommended()
DUMMY_PASSWORD_HASH = password_hash.hash("not-a-real-user-password")


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, stored_hash: str) -> bool:
    return password_hash.verify(password, stored_hash)


def verify_dummy_password(password: str) -> None:
    password_hash.verify(password, DUMMY_PASSWORD_HASH)


def create_access_token(user_id: uuid.UUID, settings: Settings) -> tuple[str, int]:
    now = datetime.now(UTC)
    lifetime = timedelta(minutes=settings.auth_access_token_minutes)
    expires_in = int(lifetime.total_seconds())
    token = jwt.encode(
        {
            "sub": f"user:{user_id}",
            "iat": now,
            "exp": now + lifetime,
        },
        settings.auth_jwt_secret.get_secret_value(),
        algorithm=ALGORITHM,
    )
    return token, expires_in
