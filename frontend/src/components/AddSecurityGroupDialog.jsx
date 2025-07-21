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

    const [instance, setInstance] = useState(null)

    async function fetchSecurityGroupList() {
        await api.get('/security-groups')
            .then(response => {
                console.log(response);
                const data = Array.from(response.data);
                for (let sg of data) {
                    if (instance.security_group_list.includes(sg.id)) {
                        data.splice(data.indexOf(sg), 1);
                    }
                }
                setSecurityGroupList(data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function fetchInstance() {
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

    async function addSecurityGroup() {
        await api.post('/add-security-group-to-instance', { instance_id: id, security_group_id: securityGroup })
            .then(response => {
                console.log(response);
                alert("Security group added successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    const handleCreate = () => {
        addSecurityGroup()
        handleCancel()
    };

    const handleCancel = () => {
        setSecurityGroupList([])
        setInstance(null)
        handleClose()
    };

    useEffect(() => {
        fetchInstance()
        fetchSecurityGroupList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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