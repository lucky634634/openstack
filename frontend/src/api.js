import axios from "axios";

const host = import.meta.env.VITE_API_HOST

const api = axios.create({
    baseURL: host,
    timeout: 100000,
});

export default api;
