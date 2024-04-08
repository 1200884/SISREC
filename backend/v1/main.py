from fastapi import FastAPI

app = FastAPI()


@app.get("/", tags=["Testing"])
async def root():
    return {"message": "Hello World"}