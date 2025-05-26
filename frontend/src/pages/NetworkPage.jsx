import React from "react";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function NetworkPage() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'age', headerName: 'Age', type: 'number', width: 100 },
    ];

    const rows = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 28 },
    ];
    return <>
        <Typography variant="h4">Network Page</Typography>
        <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ width: "100%", height: "600px" }} />
    </>
}

export default NetworkPage;
