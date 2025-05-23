from pydantic import BaseModel


class Instance(BaseModel):
    id: str
    name: str
    status: str
