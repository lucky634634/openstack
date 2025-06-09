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

export default function CreateSecurityRuleDialog({ open, handleClose, secgroup_id }) {
    const [direction, setDirection] = useState("ingress");
    const [protocol, setProtocol] = useState("tcp");
    const [portRangeMin, setPortRangeMin] = useState(0);
    const [portRangeMax, setPortRangeMax] = useState(0);
    const [remoteIpPrefix, setRemoteIpPrefix] = useState("");
    const [remoteAddressGroupId, setRemoteAddressGroupId] = useState("");
    const [ethertype, setEthertype] = useState("IPv4");

    const handleCreate = () => {
        createSecurityRule();
        handleClose()
    };

    const handleCancel = () => {
        setDirection("ingress");
        setProtocol("tcp");
        setPortRangeMin(0);
        setPortRangeMax(0);
        setRemoteIpPrefix("");
        setRemoteAddressGroupId("");
        setEthertype("IPv4");
        handleClose()
    };

    useEffect(() => {
        setDirection("ingress");
        setProtocol("tcp");
        setPortRangeMin(0);
        setPortRangeMax(0);
        setRemoteIpPrefix("");
        setRemoteAddressGroupId("");
        setEthertype("IPv4");
    }, [])

    async function createSecurityRule() {
        await api.post('/create-security-rule', {
            security_group: secgroup_id,
            direction: direction,
            protocol: protocol,
            port_range_min: portRangeMin,
            port_range_max: portRangeMax,
            remote_ip_prefix: remoteIpPrefix,
            remote_address_group_id: remoteAddressGroupId,
            ethertype: ethertype,
        })
            .then(response => {
                console.log(response);
                alert("Security rule created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Security Rule</DialogTitle>
            <DialogContent>

                <TextField
                    margin="dense"
                    id="Direction"
                    label="Direction"
                    fullWidth
                    variant="outlined"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="Protocol"
                    label="Protocol"
                    fullWidth
                    variant="outlined"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                />

                <TextField
                    margin="dense"
                    id="Port Range Min"
                    label="Port Range Min"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={portRangeMin}
                    onChange={(e) => setPortRangeMin(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="Port Range Max"
                    label="Port Range Max"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={portRangeMax}
                    onChange={(e) => setPortRangeMax(e.target.value)}
                />

                <TextField
                    margin="dense"
                    id="RemoteIpPrefix"
                    label="RemoteIpPrefix"
                    fullWidth
                    variant="outlined"
                    value={remoteIpPrefix}
                    onChange={(e) => setRemoteIpPrefix(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="RemoteAddressGroupId"
                    label="RemoteAddressGroupId"
                    fullWidth
                    variant="outlined"
                    value={remoteAddressGroupId}
                    onChange={(e) => setRemoteAddressGroupId(e.target.value)}
                />

                <TextField
                    margin="dense"
                    id="Ethertype"
                    label="Ethertype"
                    fullWidth
                    variant="outlined"
                    value={ethertype}
                    onChange={(e) => setEthertype(e.target.value)}
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