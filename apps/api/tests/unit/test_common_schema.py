import pytest
from pydantic import ValidationError

from shsg_api.schemas.common import ApiResponse
from shsg_api.schemas.service import Service


def test_generic_success_response_supports_one_model() -> None:
    service = Service(id="hvac", name="HVAC", summary="Heating and cooling.")

    response = ApiResponse[Service].ok(service, message="Service fetched")

    assert response.model_dump() == {
        "success": True,
        "data": {
            "id": "hvac",
            "name": "HVAC",
            "summary": "Heating and cooling.",
        },
        "error": None,
        "message": "Service fetched",
    }


def test_generic_success_response_supports_a_list() -> None:
    response = ApiResponse[list[str]].ok(["one", "two"])

    assert response.data == ["one", "two"]


def test_error_response_has_no_data() -> None:
    response = ApiResponse[Service].fail(
        code="SERVICE_NOT_FOUND",
        message="Service not found.",
    )

    assert response.success is False
    assert response.data is None
    assert response.error is not None
    assert response.error.code == "SERVICE_NOT_FOUND"


def test_invalid_success_error_combinations_are_rejected() -> None:
    with pytest.raises(ValidationError):
        ApiResponse[str](success=False)
