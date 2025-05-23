from pydantic import BaseModel
from typing import List

class Image(BaseModel):
    name: str
    disk_format: str