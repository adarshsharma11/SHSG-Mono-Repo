from pydantic import BaseModel


class MigrationStatus(BaseModel):
    tracking_table_exists: bool
    applied_revisions: list[str]
