import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DataGrid } from "@mui/x-data-grid";

export default function RouterDetailPage() {
    const { id } = useParams();
    const [router, setRouter] = useState(null)
    const portColumns = [
        { field: 'id', headerName: 'ID', flex: 1 },
    ]
    const [portList, setPortList] = useState([])
    const [selectedPorts, setSelectedPorts] = useState([]);

    const routeColumns = [
        { field: 'destination', headerName: 'Destination' },
        { field: 'nexthop', headerName: 'NextHop' },
    ]
    const [selectedRoutes, setSelectedRoutes] = useState([])
    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get(`/routers/${id}`)
            .then(response => {
                console.log(response);
                setRouter(response.data);
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

    useEffect(() => {
        fetchData()
    })

    return <>
        <Typography variant="h4">Router ${router.name} Detail Page</Typography>
        <Box>
            <Box>
                <Box></Box>
                <DataGrid
                    columns={portColumns}
                    rows={portList}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedPorts(rows.ids)}
                />
            </Box>
            <Box>
                <Box></Box>
                <DataGrid
                    columns={routeColumns}
                    rows={router.routes}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setSelectedRoutes(rows.ids)}
                />
            </Box>
        </Box>
    </>
}