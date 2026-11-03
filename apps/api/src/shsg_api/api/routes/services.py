from fastapi import APIRouter, HTTPException

from shsg_api.schemas.service import Service
from shsg_api.services.catalog import get_service, list_services

router = APIRouter(prefix="/services", tags=["services"])


@router.get("")
def read_services() -> list[Service]:
    return list_services()


@router.get("/{service_id}")
def read_service(service_id: str) -> Service:
    service = get_service(service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
