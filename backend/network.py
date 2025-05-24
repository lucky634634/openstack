from pydantic import BaseModel
from typing import List


class Network(BaseModel):
    id: str
    name: str
    description: str
    status: str
    subnet_ids: List[str]
    external: bool
    created_date: str
    updated_date: str

class Subnet(BaseModel):
    id: str
    name: str
    network_id: str
    description: str
    cidr: str