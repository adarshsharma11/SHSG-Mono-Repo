from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from shsg_api.api.responses import api_error_response
from shsg_api.core import get_settings
from shsg_api.core.database import get_session
from shsg_api.core.security import create_access_token
from shsg_api.core.settings import Settings
from shsg_api.schemas.auth import LoginRequest, LoginResponse, SignupRequest, UserResponse
from shsg_api.schemas.common import ApiResponse
from shsg_api.services.auth import SignupConflictError, authenticate_user, signup_user

router = APIRouter(prefix="/auth", tags=["auth"])
SessionDependency = Annotated[AsyncSession, Depends(get_session)]
SettingsDependency = Annotated[Settings, Depends(get_settings)]


@router.post(
    "/signup",
    response_model=ApiResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    responses={status.HTTP_409_CONFLICT: {"model": ApiResponse[None]}},
)
async def signup(
    request: SignupRequest,
    session: SessionDependency,
) -> ApiResponse[UserResponse] | JSONResponse:
    try:
        user = await signup_user(session, request)
    except SignupConflictError as exc:
        return api_error_response(
            status_code=status.HTTP_409_CONFLICT,
            code="ACCOUNT_ALREADY_EXISTS",
            message=str(exc),
        )
    return ApiResponse[UserResponse].ok(
        UserResponse.model_validate(user),
        message="Account created successfully.",
    )


@router.post(
    "/login",
    response_model=ApiResponse[LoginResponse],
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ApiResponse[None]}},
)
async def login(
    request: LoginRequest,
    session: SessionDependency,
    settings: SettingsDependency,
) -> ApiResponse[LoginResponse] | JSONResponse:
    user = await authenticate_user(session, request)
    if user is None:
        return api_error_response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="INVALID_CREDENTIALS",
            message="Email or password is incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, expires_in = create_access_token(user.id, settings)
    return ApiResponse[LoginResponse].ok(
        LoginResponse(
            access_token=access_token,
            expires_in=expires_in,
            user=UserResponse.model_validate(user),
        ),
        message="Login successful.",
    )
