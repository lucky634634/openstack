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
import { useState } from "react";
import api from "../api";

export default function CreateSecurityGroupDialog({ open, handleClose }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    async function createPort() {
        await api.post('/create-security-group', {
            name: name,
            description: description
        })
            .then(response => {
                console.log(response);
                alert("Security group created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    const handleCreate = () => {
        createPort()
        handleClose()
    };

    const handleCancel = () => {
        setName("")
        setDescription("")
        handleClose()
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Port</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
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