import axios from 'axios';

const urls = [
    "http://localhost:8080",
    "http://192.168.1.100:8080"
]

let api;

async function createApiInstance() {
    for (const url of urls) {
        try {
            await axios.get(url + '/health');
            api = axios.create({
                baseURL: url,
                timeout: 10000,
            });
            console.log(`Using baseURL: ${url}`);
            break;
        } catch (err) {
            console.warn(`Failed to connect to ${url}`);
        }
    }

    if (!api) {
        throw new Error("No available API endpoints.");
    }

    return api;
}

export default createApiInstance;