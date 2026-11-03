from shsg_api.services.catalog import get_service, list_services


def test_catalog_lists_home_services() -> None:
    services = list_services()

    assert [service.id for service in services] == ["hvac", "plumbing", "electrical"]


def test_known_service_is_returned() -> None:
    service = get_service("plumbing")

    assert service is not None
    assert service.name == "Plumbing"


def test_unknown_service_is_missing() -> None:
    assert get_service("roofing") is None
