from typing import Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from openstack import connection, network
import openstack
import sys

from websockets import serve

from network import *
from flavor import *
from image import *
from instance import *

# fastapi
app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# openstack
openstack.enable_logging(
    debug=True, path="openstack.log", stream=sys.stdout, format_stream=True
)

conn = openstack.connect(cloud="local")


@app.get("/health")
async def health():
    return {"status": "OK"}


@app.get("/networks/")
async def get_networks():
    networks = conn.list_networks()
    return [
        Network(
            id=net.id,
            name=net.name,
            description=net.description,
            status=net.status,
            subnet_ids=net.subnet_ids,
            external=net.is_router_external,
            created_date=net.created_at,
            updated_date=net.updated_at,
        )
        for net in networks
    ]


@app.get("/networks/{network_id}")
async def get_network(network_id: str):
    network = conn.get_network(network_id)
    return Network(
        id=network.id,
        name=network.name,
        description=network.description,
        status=network.status,
        subnet_ids=network.subnet_ids,
        external=network.is_router_external,
        created_date=network.created_at,
        updated_date=network.updated_at,
    )


@app.post("/networks")
async def create_network(
    name: str,
    external: bool,
    admin_state_up: bool = True,
    provider_network_type: Optional[str] = None,
    provider_physical_network: Optional[str] = None,
    provider_segmentation_id: Optional[int] = None,
    subnet_name: str = Query(...),
    cidr: str = Query(...),
    ip_version: int = 4,
    gateway_ip: Optional[str] = None,
    enable_dhcp: bool = True,
    dns_nameservers: Optional[List[str]] = Query(None),
):
    try:
        provider = {}
        if provider_network_type:
            provider["network_type"] = provider_network_type
        if provider_physical_network:
            provider["physical_network"] = provider_physical_network
        if provider_segmentation_id:
            provider["segmentation_id"] = provider_segmentation_id

        network = conn.create_network(
            name=name,
            admin_state_up=admin_state_up,
            external=external,
            provider=None if provider_network_type is None else provider,
        )

        subnet = conn.create_subnet(
            network_name_or_id=network.id,
            name=name,
            cidr=cidr,
            ip_version=ip_version,
            enable_dhcp=enable_dhcp,
            gateway_ip=gateway_ip,
            dns_nameservers=dns_nameservers,
        )

        return Network(
            id=network.id,
            name=network.name,
            description=network.description,
            subnet_ids=network.subnet_ids,
            status=network.status,
            external=network.is_router_external,
            created_date=network.created_at,
            updated_date=network.updated_at,
        )

    except Exception as e:
        return {"error": str(e)}


@app.get("/subnets/")
async def get_subnets():
    subnets = conn.list_subnets()
    return [
        Subnet(
            id=subnet.id,
            name=subnet.name,
            network_id=subnet.network_id,
            description=subnet.description,
            cidr=subnet.cidr,
        )
        for subnet in subnets
    ]


@app.get("/subnets/{subnet_id}")
async def get_subnet(subnet_id: str):
    subnet = conn.get_subnet(subnet_id)
    if subnet is None:
        return {"error": "Subnet not found"}
    return Subnet(
        id=subnet.id,
        name=subnet.name,
        network_id=subnet.network_id,
        description=subnet.description,
        cidr=subnet.cidr,
    )


@app.get("/flavors/")
async def get_flavors():
    flavors = conn.list_flavors()
    return [
        Flavor(
            id=flavor.id,
            name=flavor.name,
            ram=flavor.ram,
            disk=flavor.disk,
            ephemeral=flavor.ephemeral,
            vcpus=flavor.vcpus,
            description="" if flavor.description is None else flavor.description,
        )
        for flavor in flavors
    ]


@app.get("/flavors/{flavor_id}")
async def get_flavor(flavor_id: str):
    flavor = conn.get_flavor(flavor_id)
    if flavor is None:
        return {"error": "Flavor not found"}
    return Flavor(
        id=flavor.id,
        name=flavor.name,
        ram=flavor.ram,
        disk=flavor.disk,
        ephemeral=flavor.ephemeral,
        vcpus=flavor.vcpus,
        description="" if flavor.description is None else flavor.description,
    )


@app.post("/flavors")
async def create_flavors(
    name: str,
    ram: int,
    disk: int,
    ephemeral: int,
    vcpus: int,
    description: Optional[str] = None,
):
    try:
        flavor = conn.create_flavor(
            name=name,
            ram=ram,
            disk=disk,
            ephemeral=ephemeral,
            vcpus=vcpus,
            description=description,
        )
        if flavor is None:
            return {"error": "Failed to create flavor"}
        return Flavor(
            id=flavor.id,
            name=flavor.name,
            ram=flavor.ram,
            disk=flavor.disk,
            ephemeral=flavor.ephemeral,
            vcpus=flavor.vcpus,
            description="" if flavor.description is None else flavor.description,
        )
    except Exception as e:
        return {"error": str(e)}


@app.get("/images")
async def get_images():
    images = conn.list_images()
    return [
        Image(
            name=image.name,
            disk_format=image.disk_format,
        )
        for image in images
    ]


@app.get("/images/{image_name}")
async def get_image(image_name: str):
    image = conn.get_image(image_name)
    if image is None:
        return {"error": "Image not found"}
    return Image(
        name=image.name,
        disk_format=image.disk_format,
    )


@app.get("/instances")
async def get_instances():
    instances = conn.list_servers()
    return [
        Instance(
            id=instance.id,
            name=instance.name,
            status=instance.status,
        )
        for instance in instances
    ]


@app.get("/instances/{instance_id}")
async def get_instance(instance_id: str):
    instance = conn.get_server(instance_id)
    if instance is None:
        return {"error": "Instance not found"}
    return Instance(
        id=instance.id,
        name=instance.name,
        status=instance.status,
    )


@app.post("/instances")
async def create_instance(
    name: str,
    image_name: str,
    flavor_id: str,
    network_id: str,
):
    image = conn.get_image(image_name)
    if image is None:
        return {"error": "Image not found"}
    flavor = conn.get_flavor(flavor_id)
    if flavor is None:
        return {"error": "Flavor not found"}
    network = conn.get_network(network_id)
    if network is None:
        return {"error": "Network not found"}
    user_data = ""
    with open("userdata.txt", "r") as f:
        user_data = f.read()
    instance = conn.create_server(
        name=name,
        image=image,
        flavor=flavor,
        network=network,
        auto_ip=True,
        userdata=user_data,
    )

    conn.wait_for_server(instance)
    return Instance(
        id=instance.id,
        name=instance.name,
        status=instance.status,
    )


if __name__ == "__main__":
    # print("-------------------")
    # for server in conn.list_servers():
    #     print(server)
    # print("-------------------")
    host = "localhost"
    if len(sys.argv) > 1:
        host = sys.argv[1]
    uvicorn.run(app, host=host, port=8080)
