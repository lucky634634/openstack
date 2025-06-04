import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DataGrid } from "@mui/x-data-grid";
import CreatePortDialog from "../components/CreatePortDialog";
import CreateRouteDialog from "../components/CreateRouteDialog";

export default function RouterDetailPage() {
    const { id } = useParams();
    const [router, setRouter] = useState(null)
    const portColumns = [
        { field: 'id', headerName: 'ID', flex: 1 },
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
        await api.get(`/routers/${id}`)
            .then(response => {
                console.log(response);
                setRouter(response.data);
                let id = 0
                for (let route in response.data.routes) {
                    const routeData = { id: id, destination: route.destination, nexthop: route.nexthop }
                    setRouteList([...routeList, routeData])
                    id++
                }
            })
            .catch(error => {
                console.error(error);
            })

        await api.get('/ports', { router_id: router.id })
            .then(response => {
                console.log(response);
                setPortList(response.data)
            })
            .catch(error => {
                console.error(error);
            })
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
    })

    return <>
        <Typography variant="h4">Router ${router.name} Detail Page</Typography>
        <Box>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                >
                    refresh
                </Button>
            </Box>
            <Box>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedPorts.length === undefined || selectedPorts.length === 0}
                        onClick={deletePorts}
                    >
                        delete
                    </Button>

                </Box>
                <DataGrid
                    columns={portColumns}
                    rows={portList}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedPorts(rows.ids)}
                />
            </Box>
            <Box>
                <Box>

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedRoutes.length === undefined || selectedRoutes.length === 0}
                        onClick={deleteRoutes}
                    >
                        delete
                    </Button>
                </Box>
                <DataGrid
                    columns={routeColumns}
                    rows={router.routes}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedRoutes(rows.ids)}
                />
            </Box>
        </Box>

        <CreatePortDialog open={portOpen} handleClose={() => setPortOpen(false)} router={router.id} />
        <CreateRouteDialog open={routeOpen} handleClose={() => setRouteOpen(false)} router={router.id} />
    </>
}