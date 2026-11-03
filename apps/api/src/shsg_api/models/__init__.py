"""SQLAlchemy metadata registry. Import future table models here for Alembic discovery."""

from shsg_api.models.base import Base

__all__ = ["Base"]
