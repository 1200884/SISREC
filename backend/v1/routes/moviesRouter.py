from fastapi import APIRouter, Depends, HTTPException, Query
from models import *
from database import *
from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from fastapi.responses import JSONResponse
import csv
import os
import pandas as pd

router = APIRouter(prefix='/movies', tags=['Movies'])

@router.get("/search", summary="Search movie")
async def getMovie(*, q:str):
    script_dir = os.path.dirname(__file__)
    df_movies = pd.read_csv(os.path.join(script_dir, '../recommender/dataset/movies.csv'))
    result = df_movies[df_movies['title'].str.contains(q)]
    json = result.head(5).reset_index().to_dict(orient='records')
    return JSONResponse(content=json)