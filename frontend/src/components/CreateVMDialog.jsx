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

export default function CreateVMDialog({ open, handleClose }) {
    const [name, setName] = useState("");
    const [imageList, setImageList] = useState([])
    const [image, setImage] = useState("")
    const [flavorList, setFlavorList] = useState([])
    const [flavor, setFlavor] = useState("")
    const [networkList, setNetworkList] = useState([])
    const [network, setNetwork] = useState("")

    async function createVM() {
        await api.post('/create-instance', {
            name: name,
            image: image,
            flavor: flavor,
            network: network,
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

    async function fetchImageList() {
        await api.get('/images')
            .then(response => {
                console.log(response);
                try {
                    setImageList(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    async function fetchFlavorList() {
        await api.get('/flavors')
            .then(response => {
                console.log(response);
                try {
                    setFlavorList(response.data);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(error => {
                console.error(error);
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
        setImage("")
        setFlavor("")
        setNetwork("")
        handleClose()
    };

    useEffect(() => {
        fetchImageList()
        fetchFlavorList()
        fetchNetworkList()
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

                <FormControl fullWidth margin="dense">
                    <InputLabel>Image</InputLabel>
                    <Select
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        label="Image"
                    >
                        {imageList.map((image, index) => (
                            <MenuItem key={index} value={image.name}>
                                {image.name}
                            </MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel>Flavor</InputLabel>
                    <Select
                        value={flavor}
                        onChange={(e) => setFlavor(e.target.value)}
                        label="Flavor"
                    >
                        {flavorList.map((flavor, index) => (
                            <MenuItem key={index} value={flavor.name}>
                                {flavor.name}
                            </MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel>Network</InputLabel>
                    <Select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        label="Flavor"
                    >
                        {networkList.map((network, index) => (
                            <MenuItem key={index} value={network.name}>
                                {network.name}
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