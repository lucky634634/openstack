import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DataGrid } from "@mui/x-data-grid";
import CreateSecurityRuleDialog from "../components/CreateSecurityRuleDialog";

export default function SecurityGroupDetailPage() {
    const { id } = useParams();
    const [secgroup, setSecgroup] = useState({})
    const [ruleList, setRuleList] = useState([])
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'ethertype', headerName: 'Ethertype', width: 90 },
        { field: 'protocol', headerName: 'Protocol', width: 90 },
        { field: 'direction', headerName: 'Direction', width: 90 },
        { field: 'port_range_min', headerName: 'Port Range Min', width: 90 },
        { field: 'port_range_max', headerName: 'Port Range Max', width: 90 },
        { field: 'remote_ip_prefix', headerName: 'Remote IP Prefix', width: 90 },
        { field: 'remote_address_group_id', headerName: 'Remote Address Group ID', width: 90 },
        { field: 'normalized_cidr', headerName: 'Normalized CIDR', width: 90 },
        { field: 'remote_group_id', headerName: 'Remote Group ID', width: 90 },
    ]
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get(`/security-groups/`, { params: { security_group_id: id } })
            .then(response => {
                console.log(response);
                try {
                    setSecgroup(response.data);
                    setRuleList(response.data.rules)
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function deleteRules() {
        for (let id of selectedIds) {
            await api.delete(`/delete-security-rule`, { params: { rule: id } })
                .then(response => {
                    console.log(response);
                    alert("Rule deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }


    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return <>
        <Typography variant="h4">Router {secgroup.name} Detail Page</Typography>
        <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                >
                    refresh
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedIds.size === 0}
                    onClick={deleteRules}
                >
                    delete
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    Create
                </Button>

            </Box>
            <DataGrid
                columns={columns}
                rows={ruleList}
                checkboxSelection
                onRowSelectionModelChange={(rows) => setSelectedIds(rows.ids)}
            />
        </Box >
        <CreateSecurityRuleDialog open={open} handleClose={() => setOpen(false)} secgroup_id={id} />
    </>
}