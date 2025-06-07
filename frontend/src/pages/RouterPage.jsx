import React, { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api";
import CreateRouterDialog from "../components/CreateRouterDialog";
import { useNavigate } from "react-router-dom";

export default function RouterPage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const [rows, setRows] = useState([])

    const [selectedIds, setSelectedIds] = useState([]);

    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    async function fetchData() {
        await api.get('/routers')
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
            await api.delete("/delete-router", { params: { instance: id } })
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

    return <>
        <Typography variant="h4">Router Page</Typography>
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
                disabled={selectedIds.size === 0}
                onClick={deleteData}
            >
                Delete
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.size !== 1}
                onClick={
                    () => {
                        console.log(Array.from(selectedIds)[0]);
                        navigate(`/router/${Array.from(selectedIds)[0]}`)
                    }
                }
            >
                Detail
            </Button >
        </Box >
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={(ids) => setSelectedIds(ids.ids)}
            />
        </Box>
        <CreateRouterDialog open={open} handleClose={() => { setOpen(false) }} />
    </>
}
