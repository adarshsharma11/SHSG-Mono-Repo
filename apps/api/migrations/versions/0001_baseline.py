"""Establish migration tracking before business tables are introduced.

Revision ID: 0001_baseline
Revises: None
Alembic creates and records this revision in alembic_version automatically.
"""

revision: str = "0001_baseline"
down_revision: str | None = None
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
