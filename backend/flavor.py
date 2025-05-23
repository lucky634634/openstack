from pydantic import BaseModel
from typing import List


class Flavor(BaseModel):
    id: str
    name: str
    ram: int
    disk: int
    ephemeral: int
    vcpus: int
    description: str
