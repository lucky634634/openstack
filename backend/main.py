from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from openstack import connection, network
import openstack
import sys

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openstack.enable_logging(debug=True, path="openstack.log", stream=sys.stdout)

conn = openstack.connect(cloud="local")


class Network(BaseModel):
    id: str
    name: str
    status: str
    subnet_ids: List[str]
    external: bool


@app.get("/networks/")
async def get_networks():
    networks = conn.list_networks()
    return [
        Network(
            id=net.id,
            name=net.name,
            status=net.status,
            subnet_ids=net.subnet_ids,
            external=net.is_router_external,
        )
        for net in networks
    ]


if __name__ == "__main__":
    for net in conn.list_networks():
        print(net)
    uvicorn.run(app, host="localhost", port=8080)
