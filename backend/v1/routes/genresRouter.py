from fastapi import APIRouter, Depends, HTTPException, Query
from models import *
from database import *
from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
import csv
import os

router = APIRouter(prefix='/genres', tags=['Genres'])

@router.post("/", summary="Put genres in the database")
async def getGenres(*, session: AsyncSession = Depends(get_db)):
    lista = []
    script_dir = os.path.dirname(__file__)
    path = r"../recommender/dataset/movies.csv"
    file_path = os.path.join(script_dir, path)
    genre = await session.execute(select(Genre))
    if genre.scalars().all():
        raise HTTPException(status_code=404, detail="The genres were already loaded")
    with open(file_path, "r", encoding="utf8") as file:
            csv_reader = csv.reader(file)
            for linhas in csv_reader:
                genres = linhas[2]
                genresSplit = genres.split("|")
                for genre in genresSplit:
                    if genre in lista:
                        pass
                    else:
                        lista.append(genre)
    lista.remove("genres")
    for item in lista:
        gender = Genre(name=item)
        session.add(gender)
        await session.commit()
    return {"genders": lista}

@router.get("/", summary="Get all genres")
async def getGenres(*, session: AsyncSession = Depends(get_db)):
    listaGenres = []
    query = select(Genre)
    genres = await session.execute(query)
    allGenres = genres.scalars().all()
    for genre in allGenres:
        listaGenres.append(genre.name)
    return listaGenres
