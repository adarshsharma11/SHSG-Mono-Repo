from shsg_api.core.database import check_database
from shsg_api.core.settings import Settings


async def test_configured_postgres_accepts_a_query() -> None:
    """Requires the configured PostgreSQL service; never modifies database contents."""
    assert await check_database(Settings())
