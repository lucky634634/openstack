import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { DataGrid } from "@mui/x-data-grid";
import CreateSecurityRuleDialog from "../components/CreateSecurityRuleDialog";
import AddSecurityGroupDialog from "../components/AddSecurityGroupDialog";

export default function VMDetailPage() {
    const { id } = useParams();
    const [vm, setVm] = useState(null)
    const [sgList, setSgList] = useState([])
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', width: 120 },
    ]
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);

    async function fetchData() {
        await api.get(`/instances/${id}`)
            .then(response => {
                console.log(response);
                setVm(response.data);

            }).catch(error => {
                console.error(error);
            })
    }

    async function fetchSG() {
        let securityGroupList = []
        let securityGroupIds = vm.security_group_list
        for (let sg of securityGroupIds) {
            await api.get(`/security-groups/${sg}`)
                .then(response => {
                    securityGroupList.push(response.data)
                    console.log(response);
                }).catch(error => {
                    console.error(error);
                })
        }
        setSgList(Array.from(securityGroupList))
    }

    async function removeSecurityGroup(params) {
        await api.delete('/delete-security-group-from-instance', { params: { instance_id: id, security_group_id: params.security_group_id } })
            .then(response => {
                console.log(response);
                alert("Security group removed successfully");
            }).catch(error => {
                console.error(error);
                alert(error)
            })
    }


    useEffect(() => {
        fetchData()
        // fetchSG()
    }, [])


    return <>
        <Typography variant="h4">VM {id} Detail Page</Typography>
        <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { fetchData(); fetchSG(); }}
                >
                    refresh
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    Add Security Group
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedIds.length === 0}
                    onClick={removeSecurityGroup}
                >
                    Remove Security Group
                </Button>
            </Box>
            <DataGrid
                columns={columns}
                rows={sgList}
                checkboxSelection
                onRowSelectionModelChange={(rows) => setSelectedIds(Array.from(rows.ids))}
            />
        </Box >
        <AddSecurityGroupDialog id={id} open={open} handleClose={() => { setOpen(false); fetchData(); }} />
    </>
}