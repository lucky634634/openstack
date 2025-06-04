import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api";
import CreateNetworkDialog from "../components/CreateNetworkDialog";
import { useNavigate } from "react-router-dom";

function NetworkPage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name' },
        { field: 'subnet_ids', headerName: 'Subnet', width: 120 },
        { field: 'status', headerName: 'Status', width: 90 },
        { field: 'external', headerName: 'External', width: 90 },
        { field: 'provider_network_type', headerName: 'Provider Network Type', width: 120 },
    ];

    const [rows, setRows] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    async function fetchData() {
        await api.get('/networks')
            .then(response => {
                console.log(response);
                setRows(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function deleteData() {
        for (let id of selectedIds) {
            await api.delete("/delete-network", { params: { network: id } })
                .then(response => {
                    console.log(response);
                    alert("Network deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }

        await fetchData()
    }

    return <>
        <Typography variant="h4">Network Page</Typography>
        <Box sx={{ padding: "5px 0px", width: "100%" }}>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                onClick={fetchData}>Refresh</Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                onClick={() => { setOpen(true) }}
            >Create</Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length === undefined || selectedIds.length === 0}
                onClick={() => {
                    deleteData()
                    fetchData()
                }}
            >Delete</Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length === undefined || selectedIds.length !== 1}
                onClick={
                    () => {
                        console.log(selectedIds.length)
                        navigate('/network/1')
                    }
                }
            >Detail</Button>
        </Box>
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={(rows) => setSelectedIds(rows.ids)}
            />
        </Box>
        <CreateNetworkDialog
            open={open}
            handleClose={() => {
                setOpen(false)
                fetchData()
            }}
        />
    </>
}

export default NetworkPage;
