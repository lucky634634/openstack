import ForceGraph from 'react-force-graph-2d'
import './Home.css'
import { useEffect, useRef, useState } from 'preact/hooks'

export default function Home() {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, [])
    return <>
        <div className='button-list'>
            <button>Refresh</button>
        </div>
        <div className='graph-container' ref={containerRef} >
            <ForceGraph
                width={dimensions.width}
                height={dimensions.height}
            />
        </div>
    </>
}