from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from shsg_api.core.security import hash_password, verify_dummy_password, verify_password
from shsg_api.models.user import User
from shsg_api.repositories.users import add_user, get_user_by_email, get_user_by_phone
from shsg_api.schemas.auth import LoginRequest, SignupRequest


class SignupConflictError(Exception):
    pass


async def signup_user(session: AsyncSession, request: SignupRequest) -> User:
    if await get_user_by_email(session, str(request.email)) is not None:
        raise SignupConflictError("An account with this email already exists.")
    if await get_user_by_phone(session, request.phone) is not None:
        raise SignupConflictError("An account with this phone number already exists.")

    user = User(
        full_name=request.full_name,
        email=str(request.email),
        phone=request.phone,
        password_hash=hash_password(request.password.get_secret_value()),
    )
    try:
        await add_user(session, user)
        await session.commit()
        await session.refresh(user)
    except IntegrityError as exc:
        await session.rollback()
        raise SignupConflictError("An account with these details already exists.") from exc
    return user


async def authenticate_user(session: AsyncSession, request: LoginRequest) -> User | None:
    user = await get_user_by_email(session, str(request.email))
    password = request.password.get_secret_value()
    if user is None:
        verify_dummy_password(password)
        return None
    if not user.is_active or not verify_password(password, user.password_hash):
        return None
    return user
