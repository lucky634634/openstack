import { useEffect, useState } from "preact/hooks";
import Table from "../components/Table";
import createApiInstance from "../api";
import CreateVMModal from "../components/CreateVMModal";

export default function VMPage() {
    const headers = ["id", "name", "status"]
    const [data, setData] = useState([])
    const [popup, setPopup] = useState(false)

    const GetData = async () => {
        const api = await createApiInstance()
        await api.get('/instances').then((response) => {
            setData(response.data)
            console.log(response.data)
        }).catch((error) => {
            console.error(error);
        })
    }

    const openPopup = () => {
        setPopup(true)
    }


    useEffect(() => {
        GetData()
    }, [])

    return <>
        <div className='button-list'>
            <button onClick={GetData}>refresh</button>
            <button onClick={openPopup}>Create</button>
            <button>delete</button>
        </div>
        <div>
            <Table headers={headers} data={data} />
        </div>
        {popup && <CreateVMModal />}
    </>
}