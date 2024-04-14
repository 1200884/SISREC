import uvicorn
from database import *
from fastapi import FastAPI
from routes import checkRouter, userRouter,genresRouter, recommendationRouter

from models import *

app = FastAPI()

app.include_router(checkRouter.router)
app.include_router(userRouter.router)
app.include_router(genresRouter.router)
app.include_router(recommendationRouter.router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")