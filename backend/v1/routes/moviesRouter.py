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
from random import randint

router = APIRouter(prefix='/movies', tags=['Movies'])

@router.get("/search/{title}", summary="Search movie")
async def getMovie(title: str):
    titleAlt = title.lower()
    script_dir = os.path.dirname(__file__)
    df_movies = pd.read_csv(os.path.join(script_dir, '../utils/movies_full.csv'))
    result = df_movies[df_movies['titleLower'].str.contains(titleAlt)]
    json = result.head(5).reset_index().to_dict(orient='records')
    return JSONResponse(content=json)

@router.get("/randomMovie", summary="Returns random movie")
async def getRandomMovie():
    script_dir = os.path.dirname(__file__)
    df_movies = pd.read_csv(os.path.join(script_dir, '../utils/movies_full.csv'))
    number = randint(0, df_movies.shape[0])
    result = df_movies[df_movies.index == number]
    json = result.reset_index().to_dict(orient='records')
    return JSONResponse(content=json)