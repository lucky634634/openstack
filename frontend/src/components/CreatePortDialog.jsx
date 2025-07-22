import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material"
import { useEffect, useState } from "react";
import api from "../api";

export default function CreatePortDialog({ open, handleClose, router }) {
    const [subnetList, setSubnetList] = useState([])
    const [subnet, setSubnet] = useState("")

    async function createPort() {
        await api.post('/add-interface', {
            router: router,
            subnet: subnet,
        })
            .then(response => {
                console.log(response);
                alert("Port created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    async function fetchNetworkList() {
        await api.get('/subnets')
            .then(response => {
                console.log(response);
                try {
                    setSubnetList(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })

    }

    const handleCreate = () => {
        createPort()
        handleClose()
    };

    const handleCancel = () => {
        setSubnet("")
        handleClose()
    };

    useEffect(() => {
        fetchNetworkList()
    }, [])

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Port</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Subnet</InputLabel>
                    <Select
                        value={subnet}
                        onChange={(e) => setSubnet(e.target.value)}
                        label="External network"
                    >
                        {subnetList.map((sub, index) => (
                            <MenuItem key={index} value={sub.id}>
                                {sub.id} {sub.cidr}
                            </MenuItem>))}
                    </Select>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}