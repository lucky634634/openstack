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

export default function AddSecurityGroupDialog({ id, open, handleClose }) {
    const [securityGroup, setSecurityGroup] = useState()
    const [securityGroupList, setSecurityGroupList] = useState([])

    const [instance, setInstance] = useState({})

    async function fetchSecurityGroupList() {
        await api.get('/security-groups')
            .then(response => {
                console.log(response);
                try {
                    setSecurityGroupList(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function fetchInstanceList() {
        await api.get('/instances/' + id)
            .then(response => {
                console.log(response);
                try {
                    setInstance(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleCreate = () => {
        handleClose()
    };

    const handleCancel = () => {
        setSecurityGroupList([])
        setInstance({})
        handleClose()
    };

    useEffect(() => {
        fetchSecurityGroupList()
        fetchInstanceList()
    }, [])

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Add Security Group</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Security Group</InputLabel>
                    <Select
                        value={securityGroup}
                        onChange={(e) => setSecurityGroup(e.target.value)}
                        label="Security Group"
                    >
                        {securityGroupList.map((sg, index) => (
                            <MenuItem key={index} value={sg.name}>
                                {sg.name}
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