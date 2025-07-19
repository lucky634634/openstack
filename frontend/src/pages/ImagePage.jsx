
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api";
import UploadImageDialog from "../components/UploadImageDialog";


function ImagePage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name' },
    ];

    const [rows, setRows] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get('/images')
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
            await api.delete("/delete-image", { params: { image_id: id } })
                .then(response => {
                    console.log(response);
                    alert(`Image ${id} deleted successfully`);
                })
                .catch(error => {
                    console.error(error);
                })
        }

        await fetchData()
    }

    useState(() => { fetchData() }, [])

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
            >Upload</Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length === 0}
                onClick={() => {
                    deleteData()
                    fetchData()
                }}
            >Delete</Button>
        </Box>
        <Box sx={{ width: "100%", height: "600px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={(rows) => setSelectedIds(Array.from(rows.ids))}
            />
        </Box>
        <UploadImageDialog
            open={open}
            handleClose={() => {
                setOpen(false)
                fetchData()
            }}
        />
    </>
}

export default ImagePage;
