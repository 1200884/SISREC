from fastapi import APIRouter, Depends, HTTPException, Query
from models import *
from database import *
from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import desc
from time import time
import pandas as pd

router = APIRouter(prefix='/ratings', tags=['Ratings'])

@router.post("/", summary="Create a rating")
async def createRating(*, session: AsyncSession = Depends(get_db), ratingCreate: RatingCreate):
    current_timestamp = time()
    intCurrent = int(current_timestamp)
    db_rating = Rating(user_id=ratingCreate.user_id, movie_id=ratingCreate.movie_id, stars=ratingCreate.stars, timestamp=intCurrent)
    session.add(db_rating)
    await session.commit()
    await session.refresh(db_rating)
    return db_rating
