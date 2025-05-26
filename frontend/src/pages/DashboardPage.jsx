import React, { useRef, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ForceGraph from "react-force-graph-2d";

const data = {
    nodes: [
        { id: "Node 1" },
        { id: "Node 2" },
        { id: "Node 3" },
        { id: "Node 4" },
        { id: "Node 5" },
        { id: "Node 6" },
        { id: "Node 7" },
        { id: "Node 8" },
    ],
    links: [
        { source: "Node 1", target: "Node 2" },
        { source: "Node 1", target: "Node 3" },
        { source: "Node 1", target: "Node 4" },
        { source: "Node 2", target: "Node 3" },
        { source: "Node 2", target: "Node 5" },
        { source: "Node 2", target: "Node 6" },
        { source: "Node 2", target: "Node 7" },
        { source: "Node 2", target: "Node 8" },
    ],
};

function DashboardPage() {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setDimensions({ width, height });
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Box sx={{ height: "100vh", padding: 2, width: "100%" }}>
            <Typography variant="h4" gutterBottom>
                Force Graph (2D)
            </Typography>
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    width: "100%",
                    height: "500px", // Adjust for header or padding
                    border: "1px solid #ccc",
                }}
            >
                {dimensions.width > 0 && (
                    <ForceGraph
                        graphData={data}
                        width={dimensions.width}
                        height={dimensions.height}
                        nodeLabel="id"
                        nodeAutoColorBy={"id"}
                        backgroundColor="#fff"
                        linkColor={() => "#000"}
                        linkWidth={2}
                    />
                )}
            </Box>
        </Box>
    );
}

export default DashboardPage;
