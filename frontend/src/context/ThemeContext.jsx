import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = createContext();

export default function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState("light");

    const toggleColorMode = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "dark"
                        ? {
                            background: {
                                default: "#121212",
                                paper: "#1e1e1e",
                            },
                        }
                        : {}),
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
