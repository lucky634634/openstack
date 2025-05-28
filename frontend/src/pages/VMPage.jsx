import React from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import api from "../api";

export default function VMPage() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const [rows, setRows] = useState([])

    const [selectedIds, setSelectedIds] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
        console.log(selectedIds);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

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
                onClick={handleOpenDialog}
                disabled={!selectedIds.length}
            >
                Show Selected IDs
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
            >
                Create
            </Button>
        </Box >
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid rows={rows} columns={columns} checkboxSelection onRowSelectionModelChange={(ids) => setSelectedIds(Array.from(ids.ids))} />

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Selected IDs</DialogTitle>
                <DialogContent>
                    {selectedIds.map((id) => (
                        <Typography key={id}>ID: {id}</Typography>
                    ))}
                </DialogContent>
            </Dialog>
        </Box>
    </>
}
