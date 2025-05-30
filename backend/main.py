from re import S
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import InstanceOf
import uvicorn
import openstack
import sys
from dotenv import load_dotenv
import os

from openstackutil import *

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

load_dotenv()


@app.get("/health")
async def health():
    return {"status": "OK"}


# @app.get("/test")
# async def test():
#     instances = conn.get_server()
#     if instances is None:
#         return {"error": "No instances found"}
#     if len(instances) == 0:
#         return []


@app.get("/networks/")
async def get_networks():
    try:
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
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/networks/{network_id}")
async def get_network(network_id: str):
    try:
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
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.post("/create-network")
async def create_network(
    name: str,
    shared: bool = False,
    external: bool = True,
    admin_state_up: bool = True,
    provider_network_type: Optional[str] = None,
    provider_physical_network: Optional[str] = None,
    provider_segmentation_id: Optional[int] = None,
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
            shared=shared,
            external=external,
            provider=provider,
            admin_state_up=admin_state_up,
        )

        if network is None:
            return HTTPException(status_code=500, detail="Create network failed")

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
        return HTTPException(status_code=500, detail=str(e))


@app.post("/create-network-with-subnet")
async def create_network_with_subnet(payload: CreateNetworkWithSubnetRequest):
    try:
        provider = {}
        if payload.provider_network_type:
            provider["network_type"] = payload.provider_network_type
        if payload.provider_physical_network:
            provider["physical_network"] = payload.provider_physical_network
        if payload.provider_segmentation_id:
            provider["segmentation_id"] = payload.provider_segmentation_id

        network = conn.create_network(
            name=payload.name,
            admin_state_up=payload.admin_state_up,
            external=payload.external,
            provider=provider,
            shared=payload.shared,
        )

        cidr = payload.cidr
        if "/" not in cidr:
            cidr = f"{cidr}/24"

        conn.create_subnet(
            network_name_or_id=network.id,
            name=payload.subnet_name,
            cidr=cidr,
            ip_version=payload.ip_version,
            enable_dhcp=payload.enable_dhcp,
            gateway_ip=payload.gateway_ip,
            dns_nameservers=payload.dns_nameservers,
        )

        return network

    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@app.delete("/delete-network")
async def delete_network(network: str):
    try:
        result = conn.delete_network(network)
        if result:
            return {"message": "Network deleted successfully"}
        else:
            return {"error": "Network deleted unsuccessfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/subnets/")
async def get_subnets():
    try:
        subnets = conn.list_subnets()
        return [
            Subnet(
                id=subnet.id,
                name=subnet.name,
                network_id=subnet.network_id,
                description=subnet.description,
                cidr=subnet.cidr,
                dns_nameservers=[dns for dns in subnet.dns_nameservers],
                gateway_ip=subnet.gateway_ip,
            )
            for subnet in subnets
        ]
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/subnets/{subnet_id}")
async def get_subnet(subnet_id: str):
    try:
        subnet = conn.get_subnet(subnet_id)
        if subnet is None:
            return {"error": "Subnet not found"}
        return Subnet(
            id=subnet.id,
            name=subnet.name,
            network_id=subnet.network_id,
            description=subnet.description,
            cidr=subnet.cidr,
            dns_nameservers=[dns for dns in subnet.dns_nameservers],
            gateway_ip=subnet.gateway_ip,
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.post("/create-subnet")
async def create_subnet(
    network: str,
    subnet_name: str,
    cidr: str,
    ip_version: int = 4,
    disable_gateway_ip: bool = False,
    gateway_ip: Optional[str] = None,
    enable_dhcp: bool = True,
    dns_nameservers: Optional[List[str]] = Query(None),
):
    try:
        if "/" not in cidr:
            cidr = f"{cidr}/24"
        subnet = conn.create_subnet(
            network_name_or_id=network,
            name=subnet_name,
            cidr=cidr,
            ip_version=ip_version,
            enable_dhcp=enable_dhcp,
            gateway_ip=gateway_ip,
            dns_nameservers=dns_nameservers,
            disable_gateway_ip=disable_gateway_ip,
        )
        return Subnet(
            id=subnet.id,
            name=subnet.name,
            network_id=subnet.network_id,
            description=subnet.description,
            cidr=subnet.cidr,
            dns_nameservers=[dns for dns in subnet.dns_nameservers],
            gateway_ip=subnet.gateway_ip,
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.put("/update-subnet")
async def update_subnet(
    subnet: str,
    disable_gateway_ip: Optional[bool] = False,
    gateway_ip: Optional[str] = None,
):
    try:
        result = conn.update_subnet(
            name_or_id=subnet,
            disable_gateway_ip=disable_gateway_ip,
            gateway_ip=gateway_ip,
        )
        if result:
            return {"message": "Subnet updated successfully"}
        else:
            return {"error": "Subnet update unsuccessful"}
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.put("/delete-subnet")
async def delete_subnet(subnet: str):
    try:
        result = conn.delete_subnet(subnet)
        if result:
            return {"message": "Subnet deleted successfully"}
        else:
            return {"error": "Subnet deleted unsuccessfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


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


@app.post("/create-flavors")
async def create_flavors(payload: CreateFlavorRequest):
    try:
        flavor = conn.create_flavor(
            name=payload.name,
            ram=payload.ram,
            disk=payload.disk,
            ephemeral=payload.ephemeral,
            vcpus=payload.vcpus,
            description=payload.description,
        )
        if flavor is None:
            return HTTPException(status_code=500, detail="Flavor is not found")
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
        return HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-flavor")
async def delete_flavor(flavor: str):
    try:
        result = conn.delete_flavor(flavor)
        if result:
            return {"message": "Flavor deleted successfully"}
        else:
            return {"error": "Flavor deleted unsuccessfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/images")
async def get_images():
    images = conn.list_images()
    return [
        Image(
            id=image.id,
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
        id=image.id,
        name=image.name,
        disk_format=image.disk_format,
    )


@app.get("/instances")
async def get_instances():
    try:
        instances = conn.list_servers()
        return [
            Instance(
                id=instance.id,
                name=instance.name,
                status=instance.status,
                image_id=instance.image.id,
                flavor_id=instance.flavor.id,
                network_list=[
                    network_name for network_name, _ in instance.addresses.items()
                ],
            )
            for instance in instances
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/instances/{instance_id}")
async def get_instance(instance_id: str):
    try:
        instance = conn.get_server(instance_id)
        if instance is None:
            return HTTPException(status_code=500, detail="Cannot find the instance")
        return Instance(
            id=instance.id,
            name=instance.name,
            status=instance.status,
            image_id=instance.image.id,
            flavor_id=instance.flavor.id,
            network_list=[
                network_name for network_name, _ in instance.addresses.items()
            ],
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.post("/create-instance")
async def create_instance(payload: CreateVMRequest):
    try:
        image = conn.get_image(payload.image)
        if image is None:
            return HTTPException(status_code=404, detail="Image not found")
        flavor = conn.get_flavor(payload.flavor)
        if flavor is None:
            return HTTPException(status_code=404, detail="Flavor not found")
        network = conn.get_network(payload.network)
        if network is None:
            return HTTPException(status_code=404, detail="Network not found")
        user_data = (
            ""
            if payload.userdata is None or payload.userdata == ""
            else payload.userdata
        )
        if user_data == "":
            with open("userdata.txt", "r") as f:
                user_data = f.read()
        instance = conn.create_server(
            name=payload.name,
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
            image_id=instance.image.id,
            flavor_id=instance.flavor.id,
            network_list=[
                network_name for network_name, _ in instance.addresses.items()
            ],
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-instance")
async def delete_instance(instance: str):
    try:
        result = conn.delete_server(name_or_id=instance, wait=True, delete_ips=True)
        if result:
            return {"message": "Instance deleted successfully"}
        else:
            return {"error": "Instance deletion unsuccessful"}
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    host = str(os.getenv("HOST_IP", "localhost"))
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host=host, port=port)
