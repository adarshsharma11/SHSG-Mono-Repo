import httpx


async def test_list_services(client: httpx.AsyncClient) -> None:
    response = await client.get("/services")

    assert response.status_code == 200
    body = response.json()
    assert [item["id"] for item in body] == ["hvac", "plumbing", "electrical"]


async def test_get_service(client: httpx.AsyncClient) -> None:
    response = await client.get("/services/hvac")

    assert response.status_code == 200
    assert response.json()["name"] == "HVAC"


async def test_missing_service(client: httpx.AsyncClient) -> None:
    response = await client.get("/services/roofing")

    assert response.status_code == 404
    assert response.json()["detail"] == "Service not found"
