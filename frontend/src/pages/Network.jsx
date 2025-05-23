import Table from '../components/Table'
import './Network.css'

export default function Network() {
    const headers = ["id", "name", "description", "status", "external", "created_date", "updated_date"]
    const data = [
        { id: "0", name: "Node 0", },
        { id: "1", name: "Node 1", },
        { id: "2", name: "Node 2", },
        { id: "3", name: "Node 3", },
        { id: "4", name: "Node 4", },
    ]
    return (
        <>
            <div className="button-list">
                <button>Refresh</button>
            </div>
            <div className="network-container">
                <Table headers={headers} data={data} />
            </div>
        </>
    )
}