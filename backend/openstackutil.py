from click import File
from fastapi import security, File
from pydantic import BaseModel
from typing import Dict, List, Optional


class Instance(BaseModel):
    id: str
    name: str
    status: str
    network_list: List[str]
    security_group_list: List[str]


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


class CreateSubnetRequest(BaseModel):
    network: str
    subnet_name: str
    cidr: str
    ip_version: int = 4
    disable_gateway_ip: bool = False
    gateway_ip: Optional[str] = None
    enable_dhcp: bool = True
    dns_nameservers: Optional[List[str]] = None


class CreateVMRequest(BaseModel):
    name: str
    image: str
    flavor: str
    network: str
    userdata: Optional[str] = None


class CreateFlavorRequest(BaseModel):
    name: str
    ram: int
    disk: int
    ephemeral: int = 0
    vcpus: int
    description: Optional[str] = None


class CreateRouterRequest(BaseModel):
    name: str
    external_network: str


class AddInterfaceRequest(BaseModel):
    router: str
    subnet: str


class AddRouteRequest(BaseModel):
    router: str
    destination: str
    nexthop: str


class DeleteRouteRequest(BaseModel):
    router: str
    destination: str
    nexthop: str


class CreateSecurityGroupRequest(BaseModel):
    name: str
    description: str


class CreateSecurityGroupRuleRequest(BaseModel):
    security_group: str
    direction: str
    protocol: str
    port_range_min: Optional[int] = None
    port_range_max: Optional[int] = None
    description: Optional[str] = None
    remote_ip_prefix: Optional[str] = None
    remote_group_id: Optional[str] = None
    ethertype: str = "IPv4"
