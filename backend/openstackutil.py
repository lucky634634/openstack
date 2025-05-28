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


class CreateNetworkWithSubnetRequest(BaseModel):
    name: str
    external: bool = False
    shared: bool = False
    admin_state_up: bool = True
    provider_network_type: Optional[str] = None
    provider_physical_network: Optional[str] = None
    provider_segmentation_id: Optional[int] = None
    subnet_name: str
    cidr: str
    ip_version: int = 4
    gateway_ip: Optional[str] = None
    enable_dhcp: bool = True
    dns_nameservers: Optional[List[str]] = None


class CreateVMRequest(BaseModel):
    name: str
    image: str
    flavor: str
    network: str
    userdata: Optional[str] = None
