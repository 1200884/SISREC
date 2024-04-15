import uvicorn
from database import *
from fastapi import FastAPI
from routes import checkRouter, userRouter,genresRouter, recommendationRouter
from models import *
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler

@asynccontextmanager
async def lifespan(app:FastAPI):
    scheduler = BackgroundScheduler()
    recommendationRouter.nonPersonalizedToFile()
    scheduler.add_job(recommendationRouter.nonPersonalizedToFile,"interval",hours = 1)
    scheduler.start()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(checkRouter.router)
app.include_router(userRouter.router)
app.include_router(genresRouter.router)
app.include_router(recommendationRouter.router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")