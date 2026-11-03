from fastapi import APIRouter

from shsg_api.api.routes import auth, bookings, diagnostics, health, services

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(services.router)
api_router.include_router(bookings.router)
api_router.include_router(diagnostics.router)
