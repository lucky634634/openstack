
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

export default function UploadImageDialog({ open, handleClose }) {
    const [name, setName] = useState("");
    const [file, setFile] = useState();
    const [diskFormat, setDiskFormat] = useState("");
    const [visibility, setVisibility] = useState("");

    const diskFormatList = ["ami", "ari", "aki", "iso", "raw", "qcow2", "vhd", "vmdk", "ploop"];

    const visibilityList = ["public", "private", "shared", "community"];

    async function createImage() {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('disk_format', diskFormat);
        formData.append('visibility', visibility);
        formData.append('file', file);
        console.log(formData)
        await api.post('/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                console.log(response);
                alert("Image created successfully");
            })
            .catch(error => {
                console.error(error);
                alert(error)
            })
    }

    const handleCreate = () => {
        createImage()
        handleClose()
    };

    const handleCancel = () => {
        setName("");
        setDiskFormat("")
        setVisibility("")
        setFile(null)
        handleClose()
    };

    useEffect(() => {
        setName("");
        setDiskFormat("")
        setVisibility("")
        setFile(null)
    }, [])

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Button variant="outlined" component="label">
                    Select Image File
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Button>

                <FormControl fullWidth margin="dense">
                    <InputLabel>Disk format</InputLabel>
                    <Select
                        value={diskFormat}
                        onChange={(e) => setDiskFormat(e.target.value)}
                        label="Disk format"
                    >
                        {diskFormatList.map((format) => (
                            <MenuItem key={format} value={format}>{format}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Visibility</InputLabel>
                    <Select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        label="Visibility"
                    >
                        {visibilityList.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
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