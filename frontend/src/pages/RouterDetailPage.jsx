import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DataGrid } from "@mui/x-data-grid";
import CreatePortDialog from "../components/CreatePortDialog";
import CreateRouteDialog from "../components/CreateRouteDialog";

export default function RouterDetailPage() {
    const { id } = useParams();
    const [router, setRouter] = useState({})
    const portColumns = [
        { field: 'id', headerName: 'ID' },
        { field: 'network_id', headerName: 'Network', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ]
    const [portList, setPortList] = useState([])
    const [selectedPorts, setSelectedPorts] = useState([]);
    const [portOpen, setPortOpen] = useState(false)

    const routeColumns = [
        { field: 'id', headerName: 'ID', width: 20 },
        { field: 'destination', headerName: 'Destination' },
        { field: 'nexthop', headerName: 'NextHop' },
    ]
    const [routeList, setRouteList] = useState([])
    const [selectedRoutes, setSelectedRoutes] = useState([])
    const [routeOpen, setRouteOpen] = useState(false)

    async function fetchData() {
        setRouteList([])
        setPortList([])
        let routerData = {}
        const routes = []
        let ports = []
        await api.get(`/routers/${id}`)
            .then(response => {
                console.log(response);
                routerData = response.data
                let route_id = 0
                for (const route of routerData.routes) {
                    const routeData = { id: route_id, destination: route.destination, nexthop: route.nexthop }
                    routes.push(routeData)
                    route_id++
                    console.log(routeData)
                }
            })
            .catch(error => {
                console.error(error);
            })

        await api.get('/ports', { params: { router_id: id } })
            .then(response => {
                console.log(response);
                ports = response.data
            })
            .catch(error => {
                console.error(error);
            })

        setRouter(routerData)
        setRouteList(routes)
        setPortList(ports)
    }

    async function deleteRoutes() {
        for (let id of selectedRoutes) {
            const route = routeList.find((route) => route.id === id)
            await api.delete("/delete-route", { router: router.id, destination: route.destination, nexthop: route.nexthop })
                .then(response => {
                    console.log(response);
                    alert("Route deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
        await fetchData()
    }

    async function deletePorts() {
        for (let id of selectedPorts) {
            await api.delete("/delete-port", { router: router.id, port: id })
                .then(response => {
                    console.log(response);
                    alert("Port deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
        await fetchData()
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (router.id == undefined) {
        return <></>
    }

    return <>
        <Typography variant="h4">Router {router.name} Detail Page</Typography>
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                >
                    refresh
                </Button>
            </Box>
            <Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedPorts.length === 0}
                        onClick={deletePorts}
                    >
                        delete
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setPortOpen(true)}
                    >
                        Create
                    </Button>

                </Box>
                <DataGrid
                    columns={portColumns}
                    rows={portList}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedPorts(Array.from(rows.ids))}
                />
            </Box>
            <Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedRoutes.length === 0}
                        onClick={deleteRoutes}
                    >
                        delete
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setRouteOpen(true)}
                    >
                        Create
                    </Button>
                </Box>
                <DataGrid
                    columns={routeColumns}
                    rows={routeList}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedRoutes(Array.from(rows.ids))}
                />
            </Box>
        </Box >

        <CreatePortDialog
            open={portOpen}
            handleClose={() => {
                setPortOpen(false)
            }}
            router={router.id}
        />
        <CreateRouteDialog
            open={routeOpen}
            handleClose={() => {
                setRouteOpen(false)
                fetchData()
            }}
            router={router.id}
        />
    </>
}