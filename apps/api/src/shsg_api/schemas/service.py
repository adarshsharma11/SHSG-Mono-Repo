from pydantic import BaseModel


class Service(BaseModel):
    id: str
    name: str
    summary: str
