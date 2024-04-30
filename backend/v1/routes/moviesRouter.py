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
async def getMovie(*, session: AsyncSession = Depends(get_db), title: str):
    titleAlt = title.lower()
    query = select(Movie).where(Movie.titleLower.contains(titleAlt)).limit(5)
    movies = await session.execute(query)
    allMovies = movies.scalars().all()
    return allMovies

@router.get("/randomMovie", summary="Returns random movie")
async def getRandomMovie(*, session: AsyncSession = Depends(get_db)):
    number = randint(0, 62423)
    print(f" Number that has selected :{number}")
    movie = await session.get(Movie, number)
    return movie