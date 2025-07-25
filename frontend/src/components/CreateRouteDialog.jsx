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

export default function CreateRouteDialog({ open, handleClose, router }) {
    const [destination, setDestination] = useState("")
    const [nexthop, setNexthop] = useState("")

    async function createRoute() {
        await api.post('/add-route', {
            router: router,
            destination: destination,
            nexthop: nexthop
        })
            .then(response => {
                console.log(response);
                alert("Route created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    const handleCreate = () => {
        setDestination("")
        setNexthop("")
        createRoute()
        handleClose()
    };

    const handleCancel = () => {
        setDestination("")
        setNexthop("")
        handleClose()
    };


    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Route</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Destination"
                    fullWidth
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="NextHop"
                    fullWidth
                    value={nexthop}
                    onChange={(e) => setNexthop(e.target.value)}
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