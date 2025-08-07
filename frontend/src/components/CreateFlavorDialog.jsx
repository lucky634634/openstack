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
import DeleteIcon from "@mui/icons-material/Delete"
import { useEffect, useState } from "react";
import api from "../api";

export default function CreateFlavorDialog({ open, handleClose }) {
    const [name, setName] = useState("");
    const [ram, setRam] = useState(0)
    const [disk, setDisk] = useState(0)
    const [ephemeral, setEphemeral] = useState(0)
    const [vcpus, setVcpus] = useState(0)

    async function createFlavor() {
        await api.post('/create-flavor', {
            name: name,
            ram: ram,
            disk: disk,
            ephemeral: ephemeral,
            vcpus: vcpus
        })
            .then(response => {
                console.log(response);
                alert("Flavor created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    const handleCreate = () => {
        createFlavor()
        handleClose()
    };

    const handleCancel = () => {
        setName("");
        setRam(0)
        handleClose()
    };

    useEffect(() => {
    }, [])

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create VM</DialogTitle>
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

                <TextField
                    autoFocus
                    margin="dense"
                    label="Ram"
                    fullWidth
                    value={ram}
                    onChange={(e) => {
                        if (e.target.value.match(/[^0-9]/) || e.target.value === "") {
                            e.preventDefault()
                        }
                        if (!isNaN(e.target.valueAsNumber)) {
                            setRam(e.target.valueAsNumber)
                        }
                    }}
                    type="number"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Disk"
                    fullWidth
                    value={disk}
                    onChange={(e) => {
                        if (e.target.value.match(/[^0-9]/) || e.target.value === "") {
                            e.preventDefault()
                        }
                        if (!isNaN(e.target.valueAsNumber)) {
                            setDisk(e.target.valueAsNumber)
                        }
                    }}
                    type="number"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Ephemeral"
                    fullWidth
                    value={ephemeral}
                    onChange={(e) => {
                        if (e.target.value.match(/[^0-9]/) || e.target.value === "") {
                            e.preventDefault()
                        }
                        if (!isNaN(e.target.valueAsNumber)) {
                            setEphemeral(e.target.valueAsNumber)
                        }
                    }}
                    type="number"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="VCPUS"
                    fullWidth
                    value={vcpus}
                    onChange={(e) => {
                        if (e.target.value.match(/[^0-9]/) || e.target.value === "") {
                            e.preventDefault()
                        }
                        if (!isNaN(e.target.valueAsNumber)) {
                            setVcpus(e.target.valueAsNumber)
                        }
                    }}
                    type="number"
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