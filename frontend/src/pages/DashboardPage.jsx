import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import ForceGraph from "react-force-graph-2d";
import api from "../api.js";
import cloudSvg from "../assets/cloud.svg";
import pcSvg from "../assets/pc.svg";

function DashboardPage() {
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])


    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    async function fetchData() {
        setNodes([])
        setLinks([])
        const networkNodes = []
        const networkLink = []
        await api.get('networks')
            .then(res => {
                console.log(res.data)
                const networks = res.data;
                for (const network of networks) {
                    const node = {
                        id: network.id,
                        label: network.name,
                        type: 'network'
                    }
                    networkNodes.push(node)
                }
            })
            .catch(err => {
                console.error(err)
            })
        const instanceNodes = []
        await api.get('instances')
            .then(res => {
                console.log(res.data)
                const instances = res.data;
                for (const instance of instances) {
                    const node = {
                        id: instance.id,
                        label: instance.name,
                        type: 'vm'
                    }
                    instanceNodes.push(node)
                    for (const net of instance.network_list) {
                        let netSource = networkNodes.find(n => n.label === net)
                        if (netSource) {
                            const link = {
                                source: netSource.id,
                                target: instance.id,
                            }
                            networkLink.push(link)
                        }
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })

        setNodes(networkNodes.concat(instanceNodes))
        setLinks(networkLink)
        console.log(networkNodes.concat(instanceNodes))
        console.log(networkLink)
    }

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
                Graph
            </Typography>
            <Box
                sx={{ margin: "10px 0px" }}
            >
                <Button
                    variant="contained"
                    sx={{ marginRight: "5px" }}
                    color="primary"
                    onClick={fetchData}
                >
                    Refresh
                </Button>
            </Box>
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    width: "100%",
                    height: "500px",
                    border: "1px solid #ccc",
                }}
            >
                {dimensions.width > 0 && (
                    <ForceGraph
                        graphData={{ nodes, links }}
                        width={dimensions.width}
                        height={dimensions.height}
                        nodeLabel="label"
                        nodeAutoColorBy={"type"}
                        backgroundColor="#fff"
                        linkColor={() => "#000"}
                        linkWidth={2}
                        nodeCanvasObject={(node, ctx, globalScale) => {
                            const size = 10;
                            if (node.type == 'network') {
                                const image = new Image()
                                image.src = cloudSvg;
                                ctx.drawImage(image, node.x - size / 2, node.y - size / 2, size, size);
                            }
                            else if (node.type == 'vm') {
                                const image = new Image()
                                image.src = pcSvg;
                                ctx.drawImage(image, node.x - size / 2, node.y - size / 2, size, size);
                            }

                            const label = node.label || node.id;
                            const fontSize = 12 / globalScale;
                            ctx.font = `${fontSize}px Sans-Serif`;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = 'black';
                            ctx.fillText(label, node.x + 8, node.y);
                        }}

                    />
                )}
            </Box>
        </Box>
    );
}

export default DashboardPage;
