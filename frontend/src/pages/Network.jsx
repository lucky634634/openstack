import Table from '../components/Table'
import './Network.css'
import createApiInstance from '../api'
import { useState } from 'preact/hooks'

export default function Network() {
    const headers = ["id", "name", "description", "status", "external", "created_date", "updated_date"]
    const [data, setData] = useState([])

    async function GetData() {
        const api = await createApiInstance()
        await api.get('/networks').then((response) => {
            setData(response.data)
            console.log(data)
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <>
            <div className="button-list">
                <button onClick={GetData}>Refresh</button>
                <button>Delete</button>
            </div>
            <div className="network-container">
                <Table headers={headers} data={data} />
            </div>
        </>
    )
}