from pydantic import BaseModel
from typing import List, Optional


class Instance(BaseModel):
    id: str
    name: str
    status: str


class Image(BaseModel):
    name: str
    disk_format: str


class Flavor(BaseModel):
    id: str
    name: str
    ram: int
    disk: int
    ephemeral: int
    vcpus: int
    description: str


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
    dns_nameservers: Optional[List[str]] = []
    gateway_ip: Optional[str] = ""


class Router(BaseModel):
    id: str
