"""SQLAlchemy metadata registry and model imports for Alembic discovery."""

from shsg_api.models.base import Base
from shsg_api.models.user import User

__all__ = ["Base", "User"]
