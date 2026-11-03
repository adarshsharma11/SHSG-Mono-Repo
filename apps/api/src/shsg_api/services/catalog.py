from shsg_api.schemas.service import Service

CATALOG: tuple[Service, ...] = (
    Service(
        id="hvac",
        name="HVAC",
        summary="Heating, cooling, and indoor air quality.",
    ),
    Service(
        id="plumbing",
        name="Plumbing",
        summary="Leaks, fixtures, and water heaters.",
    ),
    Service(
        id="electrical",
        name="Electrical",
        summary="Lighting, panels, and safety repairs.",
    ),
)


def list_services() -> list[Service]:
    return list(CATALOG)


def get_service(service_id: str) -> Service | None:
    return next((service for service in CATALOG if service.id == service_id), None)
