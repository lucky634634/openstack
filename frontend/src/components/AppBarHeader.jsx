import React from "react";
import { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../context/ThemeContext";

function AppBarHeader() {
    const { toggleColorMode, mode } = useContext(ColorModeContext);

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My Dashboard
                </Typography>
                <IconButton color="inherit" onClick={toggleColorMode}>
                    {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default AppBarHeader;
