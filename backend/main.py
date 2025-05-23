from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from openstack import connection, network
import openstack
import sys

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
openstack.enable_logging(debug=True, path="openstack.log")

conn = openstack.connect(cloud="local")


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
            created_data=net.created_at,
            updated_data=net.updated_at,
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
        created_data=network.created_at,
        updated_data=network.updated_at,
    )


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
            id=instance.id,  # type: ignore
            name=instance.name,  # type: ignore
            status=instance.status,  # type: ignore
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


if __name__ == "__main__":
    print("-------------------")
    for server in conn.list_servers():
        print(server)
    print("-------------------")
    uvicorn.run(app, host="localhost", port=8080)
