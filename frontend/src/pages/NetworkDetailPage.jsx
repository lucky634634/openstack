import { useParams } from "react-router-dom";

export default function NetworkDetailPage() {
    const { id } = useParams();
    return <div>
        <h1>Network Detail Page</h1>
        <p>Network ID: {id}</p>
    </div>
}