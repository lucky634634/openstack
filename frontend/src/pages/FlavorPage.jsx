import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api";
import CreateFlavorDialog from "../components/CreateFlavorDialog";

export default function FlavorPage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'vcpus', headerName: 'VCPUS', width: 90 },
        { field: 'ram', headerName: 'RAM', width: 90 },
        { field: 'disk', headerName: 'Disk', width: 90 },
        { field: 'ephemeral', headerName: 'Ephemeral', width: 90 },
    ];

    const [rows, setRows] = useState([])

    const [selectedIds, setSelectedIds] = useState([]);

    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get('/flavors')
            .then(response => {
                console.log(response);
                try {
                    setRows(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function deleteData() {
        for (let id of selectedIds) {
            await api.delete("/delete-flavor", { params: { instance: id } })
                .then(response => {
                    console.log(response);
                    alert("Instance deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
        await fetchData()
    }

    useEffect(() => { fetchData() }, [])

    return <>
        <Typography variant="h4">Flavor Page</Typography>
        <Box sx={{ padding: "5px 0px", width: "100%" }}>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                onClick={fetchData}
            >
                Refresh
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                onClick={() => { setOpen(true) }}
            >
                Create
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length === 0}
                onClick={deleteData}
            >
                Delete
            </Button>
        </Box >
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={(rows) => setSelectedIds(Array.from(rows.ids))}
            />
        </Box>
        <CreateFlavorDialog
            open={open}
            handleClose={() => {
                setOpen(false)
                fetchData()
            }}
        />
    </>
}
