import React, { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createApiInstance } from "../api";

function NetworkPage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'subnet', headerName: 'Subnet', width: 120 },
        { field: 'gateway', headerName: 'Gateway', width: 120 },
    ];

    const rows = [
    ];

    const [selectedIds, setSelectedIds] = useState([]);

    async function fetchData() {
        const api = createApiInstance()
        try {
            const response = await api.get('/networks')
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        <Typography variant="h4">Network Page</Typography>
        <Box sx={{ padding: "5px 0px", width: "100%" }}>
            <Button onClick={fetchData}>Refresh</Button>
            <Button>Create</Button>
        </Box>
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid rows={rows} columns={columns} checkboxSelection onRowSelectionModelChange={(rows) => setSelectedIds(rows.ids)} />
        </Box>
    </>
}

export default NetworkPage;
