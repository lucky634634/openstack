import React from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import api from "../api";
import CreateVMDialog from "../components/CreateVMDialog";
// import { useNavigate } from "react-router-dom";

export default function VMPage() {
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const [rows, setRows] = useState([])

    const [selectedIds, setSelectedIds] = useState([]);

    const [open, setOpen] = useState(false);

    // const navigate = useNavigate()

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

    async function rebootVM() {
        for (let id of selectedIds) {
            await api.post("/reboot-instance", { params: { instance: id } })
                .then(response => {
                    console.log(response);
                    alert("Instance active successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
        await fetchData()
    }

    async function GetConsole() {
        for (let id of selectedIds) {
            await api.get("/get-console", { params: { instance: id } })
                .then(response => {
                    console.log(response);
                    alert(response.data.url);
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
                disabled={selectedIds.length === 0}
                onClick={deleteData}
            >
                Delete
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length === 0}
                onClick={rebootVM}
            >
                Reboot
            </Button>
            <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                onClick={GetConsole}
                disabled={selectedIds.length !== 1}
            >
                Get Console
            </Button>
            {/* <Button
                variant="contained"
                sx={{ marginRight: "5px" }}
                color="primary"
                disabled={selectedIds.length !== 1}
                onClick={() => {
                    navigate("/add-remove-security-group/" + selectedIds[0])
                }}
            >
                Add/Remove Security Group
            </Button> */}
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
