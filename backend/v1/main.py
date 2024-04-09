import uvicorn
from fastapi import FastAPI
from routes import checkRouter, userRouter
from models import *

app = FastAPI()

app.include_router(checkRouter.router)
app.include_router(userRouter.router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")