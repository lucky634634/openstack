import Table from '../components/Table'
import './Network.css'
import createApiInstance from '../api'
import { useEffect, useState } from 'preact/hooks'

export default function Network() {
    const headers = ["id", "name", "description", "status", "external", "created_date", "updated_date"]
    const [data, setData] = useState([])

    async function GetData() {
        const api = await createApiInstance()
        await api.get('/networks').then((response) => {
            setData(response.data)
            console.log(response.data)
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        GetData()
    }, [])

    return (
        <>
            <div className='button-list'>
                <button onclick={GetData}>refresh</button>
                <button>delete</button>
            </div>
            <div classname="network-container">
                <Table headers={headers} data={data} />
            </div>
        </>
    )
}