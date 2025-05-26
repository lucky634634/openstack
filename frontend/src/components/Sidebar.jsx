import React from "react";
import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ComputerIcon from '@mui/icons-material/Computer';
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";

const drawerWidth = 240;

const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Network", icon: <CloudQueueIcon />, path: "/network" },
    { text: "VM", icon: <ComputerIcon />, path: "/vm" },
];

function Sidebar() {
    const location = useLocation();
    const theme = useTheme();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
        >
            <Toolbar />
            <List>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={isActive}
                            sx={{
                                backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: theme.palette.text.primary }} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Drawer>
    );
}

export default Sidebar;
