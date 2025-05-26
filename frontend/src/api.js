import axios from "axios";

const urls = [
    "localhost:8080",
    "192.168.1.100:8080"
]

let api;

async function CreateApiInstance() {
    for (const url of urls){
        try {
            await axios.get(url + '/health');
            api = axios.create({
                baseURL: url,
                timeout: 5000,
            });
            return api;
        } catch (error) {
            console.error(`Failed to create API instance for ${url}:`, error);
        }
    } 
    if (!api) {
        console.error("No valid API instance created.");
    }

    return api;
}

export default CreateApiInstance;