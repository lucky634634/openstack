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
import { useState } from "react";
import api from "../api";

export default function CreateSubnetDialog({ network, open, handleClose }) {
    const [subnetName, setSubnetName] = useState("")
    const [cidr, setCidr] = useState("")
    const [ipVersion, setIPVersion] = useState("4")
    const [gateway, setGateway] = useState("")
    const [disableGateway, setDisableGateway] = useState(false);
    const [enableDHCP, setEnableDHCP] = useState(true)
    const [dnsInput, setDnsInput] = useState("");
    const [dnsNameservers, setDnsNameservers] = useState([]);

    const handleAddDns = () => {
        if (dnsInput.trim() && !dnsNameservers.includes(dnsInput.trim())) {
            setDnsNameservers([...dnsNameservers, dnsInput.trim()]);
            setDnsInput("");
        }
    };

    const handleRemoveDns = (dns) => {
        setDnsNameservers(dnsNameservers.filter(item => item !== dns));
    };

    async function createNetwork() {
        await api.post('/create-subnet',
            {
                network: network,
                subnet_name: subnetName,
                cidr: cidr,
                ip_version: ipVersion,
                gateway_ip: gateway,
                enable_dhcp: enableDHCP,
                dns_nameservers: dnsNameservers
            }
        )
            .then(response => {
                console.log(response);
                alert("Subnet created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error);
            })
    }

    const handleCreate = () => {
        createNetwork()
        handleClose()
    };

    const handleCancel = () => {
        setSubnetName("")
        setCidr("")
        setIPVersion("4")
        setGateway("")
        setDisableGateway(false)
        setDnsInput("");
        setDnsNameservers([]);
        handleClose()
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Create Network</DialogTitle>
            <DialogContent>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Subnet Name"
                    fullWidth
                    value={subnetName}
                    onChange={(e) => setSubnetName(e.target.value)}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    label="CIDR"
                    fullWidth
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                    required
                />

                <TextField
                    autoFocus
                    margin="dense"
                    label="IP Version"
                    fullWidth
                    value={ipVersion}
                    onChange={(e) => setIPVersion(e.target.value)}
                    type="number"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Gateway"
                    fullWidth
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                    disabled={disableGateway}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={disableGateway}
                            onChange={(e) => setDisableGateway(e.target.checked)}
                        />
                    }
                    label="Disable Gateway"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={enableDHCP}
                            onChange={(e) => setEnableDHCP(e.target.checked)}
                        />
                    }
                    label="Enable DHCP"
                />

                <TextField
                    margin="dense"
                    label="Add DNS Nameserver"
                    fullWidth
                    value={dnsInput}
                    onChange={(e) => setDnsInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDns();
                        }
                    }}
                />

                <Button onClick={handleAddDns} size="small" sx={{ mt: 1, mb: 2 }}>
                    Add DNS
                </Button>

                <List dense>
                    {dnsNameservers.map((dns, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveDns(dns)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={dns} />
                        </ListItem>
                    ))}
                </List>
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