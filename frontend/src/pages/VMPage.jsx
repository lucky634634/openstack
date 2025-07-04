import React from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import api from "../api";
import CreateVMDialog from "../components/CreateVMDialog";

export default function VMPage() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const [rows, setRows] = useState([])

    const [selectedIds, setSelectedIds] = useState([]);

    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get('/instances')
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
            await api.delete("/delete-instance", { params: { instance: id } })
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

    React.useEffect(() => { fetchData() }, [])

    return <>
        <Typography variant="h4">VM Page</Typography>
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
        </Box >
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid rows={rows} columns={columns} checkboxSelection onRowSelectionModelChange={(ids) => setSelectedIds(Array.from(ids.ids))} />
        </Box>
        <CreateVMDialog
            open={open}
            handleClose={() => {
                setOpen(false)
                fetchData()
            }}
        />
    </>
}
