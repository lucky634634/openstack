from fastapi import FastAPI
import uvicorn

app = FastAPI(debug=True)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080) 
