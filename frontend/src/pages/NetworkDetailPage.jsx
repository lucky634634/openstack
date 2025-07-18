import { useParams } from "react-router-dom";
import api from "../api";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CreateSubnetDialog from "../components/CreateSubnetDialog";

export default function NetworkDetailPage() {
    const { id } = useParams();
    const [network, setNetwork] = useState({})
    const subnetColumns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
        { field: 'cidr', headerName: 'cidr', width: 120 },
    ]
    const [subnetList, setSubnetList] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);

    async function fetchData() {
        setSubnetList([])
        let net = {}
        const subnets = []
        await api.get(`/networks/${id}`)
            .then(response => {
                console.log(response);
                try {
                    net = response.data
                    console.log(net)
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })

        for (let subnet_id of net.subnet_ids) {
            await api.get(`/subnets/${subnet_id}`)
                .then(response => {
                    console.log(response);
                    try {
                        subnets.push(response.data)
                    } catch (error) {
                        console.error(error);
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }

        setNetwork(net)
        setSubnetList(subnets)
    }

    async function deleteSubnets() {
        for (let id of selectedIds) {
            await api.delete(`/delete-subnet`, { subnet: id })
                .then(response => {
                    console.log(response);
                    alert(`Subnet ${id} deleted successfully`);
                })
                .catch(error => {
                    console.error(error);
                })
        }
        setSelectedIds([])
        await fetchData()
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <Typography variant="h4">Network {network.name}</Typography>
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => fetchData()}
                >
                    Refresh
                </Button>
                <Button
                    variant="contained"
                    disabled={selectedIds.length === 0}
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
                onRowSelectionModelChange={(ids) => setSelectedIds(Array.from(ids.ids))}
            />
        </Box>
        <CreateSubnetDialog
            open={open}
            handleClose={() => {
                setOpen(false)
                fetchData()
            }}
            network={network.id}
        />
    </>
}