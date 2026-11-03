import httpx


async def test_website_origin_is_allowed(client: httpx.AsyncClient) -> None:
    response = await client.get("/health", headers={"Origin": "http://localhost:9001"})

    assert response.headers["access-control-allow-origin"] == "http://localhost:9001"


async def test_unknown_origin_is_not_reflected(client: httpx.AsyncClient) -> None:
    response = await client.get("/health", headers={"Origin": "http://evil.example"})

    assert "access-control-allow-origin" not in response.headers
