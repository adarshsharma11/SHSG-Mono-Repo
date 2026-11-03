import pytest
from pydantic import ValidationError

from shsg_api.schemas.auth import SignupRequest


def test_signup_normalizes_identity_fields() -> None:
    request = SignupRequest(
        full_name="  Ada   Lovelace  ",
        email="ADA@Example.COM",
        phone="+1 (555) 123-4567",
        password="correct-horse-battery-staple",
    )

    assert request.full_name == "Ada Lovelace"
    assert request.email == "ada@example.com"
    assert request.phone == "+15551234567"


@pytest.mark.parametrize("phone", ["123", "+01234567", "phone-number"])
def test_signup_rejects_invalid_phone(phone: str) -> None:
    with pytest.raises(ValidationError, match="Phone must contain"):
        SignupRequest(
            full_name="Ada Lovelace",
            email="ada@example.com",
            phone=phone,
            password="correct-horse-battery-staple",
        )


def test_signup_requires_an_eight_character_password() -> None:
    with pytest.raises(ValidationError):
        SignupRequest(
            full_name="Ada Lovelace",
            email="ada@example.com",
            phone="+15551234567",
            password="short",
        )
