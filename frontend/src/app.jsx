import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";

import AppBarHeader from "./components/AppBarHeader";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import NetworkPage from "./pages/NetworkPage";
import VMPage from "./pages/VMPage";
import FlavorPage from "./pages/FlavorPage";
import RouterPage from "./pages/RouterPage";
import NetworkDetailPage from "./pages/NetworkDetailPage";
import RouterDetailPage from "./pages/RouterDetailPage";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBarHeader />
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/vm" element={<VMPage />} />
            <Route path="/flavor" element={<FlavorPage />} />
            <Route path="/router" element={<RouterPage />} />
            <Route path="/network/:id" element={<NetworkDetailPage />} />
            <Route path="/router/:id" element={<RouterDetailPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
