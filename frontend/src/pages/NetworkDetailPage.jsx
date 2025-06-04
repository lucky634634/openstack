import { useParams } from "react-router-dom";
import api from "../api";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CreateSubnetDialog from "../components/CreateSubnetDialog";

export default function NetworkDetailPage() {
    const { id } = useParams();
    const [network, setNetwork] = useState(null)
    const subnetColumns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'cidr', headerName: 'cidr', width: 120 },
    ]
    const [subnetList, setSubnetList] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);

    async function fetchNetwork() {
        await api.get(`/networks/${id}`)
            .then(response => {
                console.log(response);
                try {
                    setNetwork(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })

        for (let subnet_id of network.subnet_ids) {
            await api.get(`/subnets/${subnet_id}`)
                .then(response => {
                    console.log(response);
                    try {
                        setSubnetList([...subnetList, response.data])
                    } catch (error) {
                        console.error(error);
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    async function deleteSubnets() {
        for (let id of selectedIds) {
            await api.delete(`/subnets/${id}`)
                .then(response => {
                    console.log(response);
                    alert("Subnet deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
        setSelectedIds([])
        await fetchNetwork()
    }

    useEffect(() => {
        fetchNetwork();
    });

    return <>
        <Typography variant="h4">Network {network.name}</Typography>
        <Box>
            <Box>
                <Button
                    variant="contained"
                    onClick={() => fetchNetwork()}
                >
                    Refresh
                </Button>
                <Button
                    variant="contained"
                    disabled={selectedIds.length === undefined || selectedIds.length === 0}
                    onClick={() => deleteSubnets()}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    onClick={() => deleteSubnets()}
                >
                    Create subnet
                </Button>
            </Box>
            <DataGrid
                columns={subnetColumns}
                rows={subnetList}
                checkboxSelection
                onRowSelectionModelChange={(ids) => setSelectedIds(ids.ids)}
            />
        </Box>
        <CreateSubnetDialog open={open} handleClose={() => setOpen(false)} network={network.id} />
    </>
}