import axios from "axios";

let host = import.meta.env.VITE_API_HOST
if (host === undefined) {
    host = "http://localhost:8080"
}

const api = axios.create({
    baseURL: host,
    timeout: 100000,
});

export default api;
