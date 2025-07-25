
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

export default function CreateRouterDialog({ open, handleClose }) {
    const [name, setName] = useState("");
    const [networkList, setNetworkList] = useState([])
    const [network, setNetwork] = useState("")

    async function createVM() {
        await api.post('/create-router', {
            name: name,
            external_network: network,
        })
            .then(response => {
                console.log(response);
                alert("VM created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    async function fetchNetworkList() {
        await api.get('/networks')
            .then(response => {
                console.log(response);
                try {
                    setNetworkList(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })

    }

    const handleCreate = () => {
        createVM()
        handleClose()
    };

    const handleCancel = () => {
        setName("");
        setNetwork("")
        handleClose()
    };

    useEffect(() => {
        fetchNetworkList()
    }, [])

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Router</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="VM Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel>Network</InputLabel>
                    <Select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        label="External network"
                    >
                        {networkList.map((network, index) => (
                            <MenuItem key={index} value={network.id}>
                                {network.id}
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