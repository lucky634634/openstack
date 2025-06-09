from re import S
from typing import Optional
from unittest import result
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import openstack
from openstack.compute.v2.server import Server
from openstack.network.v2.router import Router
from openstack.network.v2.network import Network
from openstack.network.v2.security_group import SecurityGroup
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
openstack.enable_logging(debug=True, path="openstack.log", format_stream=True)

conn = openstack.connect(cloud="local")

load_dotenv()


@app.get("/")
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
        return [net for net in networks]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/networks/{network_id}")
async def get_network(network_id: str):
    try:
        network = conn.get_network(network_id)
        return network
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
            raise HTTPException(status_code=500, detail="Create network failed")

        return network
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-network")
async def delete_network(network: str):
    try:
        result = conn.delete_network(network)
        if result:
            return {"message": "Network deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail=str("Deleted network failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/subnets/")
async def get_subnets():
    try:
        subnets = conn.list_subnets()
        return [subnet for subnet in subnets]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/subnets/{subnet_id}")
async def get_subnet(subnet_id: str):
    try:
        subnet = conn.get_subnet(subnet_id)
        if subnet is None:
            raise HTTPException(status_code=500, detail=str("Subnet not found"))
        return subnet
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-subnet")
async def create_subnet(payload: CreateSubnetRequest):
    try:
        if "/" not in payload.cidr:
            cidr = f"{payload.cidr}/24"
        subnet = conn.create_subnet(
            network_name_or_id=payload.network,
            name=payload.subnet_name,
            cidr=payload.cidr,
            ip_version=payload.ip_version,
            enable_dhcp=payload.enable_dhcp,
            gateway_ip=payload.gateway_ip,
            dns_nameservers=payload.dns_nameservers,
            disable_gateway_ip=payload.disable_gateway_ip,
        )
        return subnet
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
            return HTTPException(status_code=500, detail=str("Subnet update failed"))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.put("/delete-subnet")
async def delete_subnet(subnet: str):
    try:
        result = conn.delete_subnet(subnet)
        if result:
            return {"message": "Subnet deleted successfully"}
        else:
            return HTTPException(status_code=500, detail=str("Deleted subnet failed"))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/flavors/")
async def get_flavors():
    try:
        flavors = conn.list_flavors()
        return [flavor for flavor in flavors]
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/flavors/{flavor_id}")
async def get_flavor(flavor_id: str):
    try:
        flavor = conn.get_flavor(flavor_id)
        if flavor is None:
            return HTTPException(status_code=500, detail=str("Flavor not found"))
        return flavor
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


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
        return flavor
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-flavor")
async def delete_flavor(flavor: str):
    try:
        result = conn.delete_flavor(flavor)
        if result:
            return {"message": "Flavor deleted successfully"}
        else:
            return HTTPException(status_code=500, detail=str("Flavor deletion failed"))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/images")
async def get_images():
    images = conn.list_images()
    return [image for image in images]


@app.get("/images/{image_name}")
async def get_image(image_name: str):
    image = conn.get_image(image_name)
    if image is None:
        return {"error": "Image not found"}
    return image


@app.get("/instances")
async def get_instances():
    try:
        instances = conn.list_servers()
        return [
            Instance(
                id=instance.id,
                name=instance.name,
                status=instance.status,
                network_list=[network for network in instance.addresses.keys()],
            )
            for instance in instances
            if instance is not None
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
            network_list=[network for network in instance.addresses.keys()],
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.post("/create-instance")
async def create_instance(payload: CreateVMRequest):
    try:
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
            image=payload.image,
            flavor=payload.flavor,
            network=payload.network,
            auto_ip=True,
            userdata=user_data,
        )
        # conn.wait_for_server(instance)
        return Instance(
            id=instance.id,
            name=instance.name,
            status=instance.status,
            network_list=[network for network in instance.addresses.keys()],
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
            return HTTPException(
                status_code=500, detail=str("Instance deletion failed")
            )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/routers")
async def get_routers():
    try:
        routers = conn.list_routers()
        return [router for router in routers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/routers/{router_id}")
async def get_router(router_id: str):
    try:
        router = conn.get_router(router_id)
        if router is None:
            raise HTTPException(status_code=500, detail="Router not found")
        return router
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-router")
async def create_router(payload: CreateRouterRequest):
    try:
        external_net = conn.get_network(payload.external_network)
        if external_net is None:
            raise HTTPException(status_code=404, detail="External network not found")
        router = conn.create_router(
            name=payload.name, ext_gateway_net_id=external_net.id, enable_snat=True
        )
        if router is None:
            raise HTTPException(status_code=500, detail="Create router failed")
        return router
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/ports")
async def get_ports(router_id: str):
    try:
        router = conn.get_router(name_or_id=router_id)
        if router is None:
            raise HTTPException(status_code=404, detail="Router not found")
        ports = conn.list_router_interfaces(router=router)
        return ports
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add-interface")
async def add_interface(payload: AddInterfaceRequest):
    try:
        router = conn.get_router(payload.router)
        if router is None:
            raise HTTPException(status_code=404, detail="Router not found")
        subnet = conn.get_subnet(payload.subnet)
        if subnet is None:
            raise HTTPException(status_code=404, detail="Subnet not found")
        return conn.add_router_interface(router, subnet.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/remove-interface")
async def remove_interface(
    router_id: str, subnet_id: Optional[str] = None, port_id: Optional[str] = None
):
    try:
        router = conn.get_router(router_id)
        result = conn.remove_router_interface(
            router=router, subnet_id=subnet_id, port_id=port_id
        )

        if result is None:
            return {"message": "Interface removed successfully"}
        else:
            raise HTTPException(status_code=500, detail=str("Interface removal failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-router")
async def delete_router(router_id: str):
    try:
        router = conn.get_router(router_id)
        if router.external_gateway_info:
            conn.update_router(router.id, ext_gateway_net_id=None)
        ports = conn.list_router_interfaces(router)
        for port in ports:
            if port.device_owner in [
                "network:router_interface",
                "network:router_gateway",
            ]:
                conn.remove_router_interface(router.id, port_id=port.id)
            conn.delete_port(port.id)
        result = conn.delete_router(router_id)
        if result:
            return {"message": "Router deleted successfully"}
        raise HTTPException(status_code=500, detail=str("Router deletion failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add-route")
async def add_route(payload: AddRouteRequest):
    try:
        router = conn.get_router(name_or_id=payload.router)
        print(type(router))
        if router is None:
            raise HTTPException(status_code=404, detail="Router not found")
        routes = router.routes
        routes.append({"destination": payload.destination, "nexthop": payload.nexthop})
        result = conn.update_router(name_or_id=router.id, routes=routes)
        if result is None:
            raise HTTPException(status_code=500, detail=str("Route addition failed"))
        if result.routes == routes:
            return {"message": "Route added successfully"}
        raise HTTPException(status_code=500, detail=str("Route addition failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-route")
async def delete_route(payload: DeleteRouteRequest):
    try:
        router = conn.get_router(name_or_id=payload.router)
        if router is None:
            raise HTTPException(status_code=404, detail="Router not found")
        routes = [
            route
            for route in router.routes
            if route["destination"] != payload.destination
            or route["nexthop"] != payload.nexthop
        ]
        result = conn.update_router(name_or_id=router.id, routes=routes)
        if result is None:
            raise HTTPException(status_code=500, detail=str("Route deletion failed"))
        if result.routes == routes:
            return {"message": "Route deleted successfully"}
        raise HTTPException(status_code=500, detail=str("Route deletion failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/security-groups")
async def get_security_groups():
    try:
        security_groups = conn.list_security_groups()
        return [security_group for security_group in security_groups]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/security-groups/${security_group_id}")
async def get_security_group(security_group_id: str):
    try:
        security_group = conn.get_security_group(security_group_id)
        if security_group is None:
            raise HTTPException(status_code=404, detail="Security group not found")
        return security_group
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-security-group")
async def create_security_group(payload: CreateSecurityGroupRequest):
    try:
        security_group = conn.create_security_group(
            name=payload.name, description=payload.description
        )
        return security_group
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-security-group")
async def delete_security_group(security_group_id: str):
    try:
        security_group = conn.get_security_group(security_group_id)
        if security_group is None:
            raise HTTPException(status_code=404, detail="Security group not found")
        result = conn.delete_security_group(security_group_id)
        if result:
            return {"message": "Security group deleted successfully"}
        raise HTTPException(
            status_code=500, detail=str("Security group deletion failed")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-security-rule")
async def create_security_rule(payload: CreateSecurityGroupRuleRequest):
    try:
        security_group = conn.get_security_group(payload.security_group)
        if security_group is None:
            return HTTPException(status_code=404, detail="Security group not found")
        result = conn.create_security_group_rule(
            secgroup_name_or_id=security_group.id,  # type: ignore
            direction=payload.direction,
            protocol=payload.protocol,
            port_range_min=payload.port_range_min,
            port_range_max=payload.port_range_max,
            description=payload.description,
            remote_ip_prefix=payload.remote_ip_prefix,
            remote_group_id=payload.remote_group_id,
            ethertype=payload.ethertype,
        )
        if result:
            return {"message": "Security rule created successfully"}
        raise HTTPException(
            status_code=500, detail=str("Security rule creation failed")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete-security-rule")
async def delete_security_rule(security_rule_id: str):
    try:
        result = conn.delete_security_group_rule(rule_id=security_rule_id)
        if result:
            return {"message": "Security rule deleted successfully"}
        return HTTPException(
            status_code=500, detail=str("Security rule deletion failed")
        )
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@app.get("/security-rules")
async def get_security_rules(security_group: str):
    try:
        secgroup = conn.get_security_group(name_or_id=security_group)
        if secgroup is None:
            return HTTPException(status_code=404, detail="Security group not found")
        return secgroup.security_group_rules

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    host = str(os.getenv("HOST_IP", "localhost"))
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host=host, port=port)
