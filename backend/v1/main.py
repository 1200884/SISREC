from fastapi import FastAPI
from routes import checkRouter, userRouter
from models import *


app = FastAPI()

app.include_router(checkRouter.router)
app.include_router(userRouter.router)