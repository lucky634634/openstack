from fastapi import FastAPI
import uvicorn

app = FastAPI(debug=True)

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.1.102", port=8000) 
