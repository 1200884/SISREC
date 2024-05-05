from fastapi import APIRouter, Depends, HTTPException, Query
from models import *
from database import *
from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, text
from sqlalchemy import desc
from time import time

router = APIRouter(prefix='/ratings', tags=['Ratings'])

@router.post("/", summary="Create a rating")
async def createRating(*, session: AsyncSession = Depends(get_db), ratingCreate: RatingCreate):
    query = select(Rating).where(Rating.user_id == ratingCreate.user_id).where(Rating.movie_id == ratingCreate.movie_id)
    result = await session.execute(query)
    rating = result.scalars().first()
    if rating:
        raise HTTPException(status_code=404, detail="Rating already exists for this user and movie")
    current_timestamp = time()
    intCurrent = int(current_timestamp)
    db_rating = Rating(user_id=ratingCreate.user_id, movie_id=ratingCreate.movie_id, stars=ratingCreate.stars, timestamp=intCurrent)
    session.add(db_rating)
    await session.commit()
    await session.refresh(db_rating)
    return db_rating

@router.get("/", summary="Get a rating by user and movie")
async def getRating(*, session: AsyncSession = Depends(get_db), user_id: int, movie_id: int):
    query = select(Rating).where(Rating.user_id == user_id).where(Rating.movie_id == movie_id)
    result = await session.execute(query)
    rating = result.scalars().first()
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    else:
        return rating

@router.get("/history/{userid}", summary="Get last 5 ratings of a user")
async def getRatings(*, session: AsyncSession = Depends(get_db), userid: int):
    query = select(Rating).where(Rating.user_id == userid).order_by(desc(Rating.timestamp)).limit(5)
    result = await session.execute(query)
    ratings = result.scalars().all()
    if not ratings:
        raise HTTPException(status_code=404, detail="Ratings not found")
    ratingList = list_rating_to_list_rating_return(ratings)
    for rating in ratingList:
        query = select(Movie).where(Movie.movieid == rating.movie_id)
        result = await session.execute(query)
        ratingQuery = result.scalars().first()
        rating.titleMovie = ratingQuery.title
        rating.genresMovie = ratingQuery.genres
        rating.imdbidMovie = ratingQuery.imdbid
        rating.yearMovie = ratingQuery.year
        rating.urlMovie = ratingQuery.url
    return ratingList

@router.get("/favoriteMovies/{userid}", summary="Get favorite movies of a user")
async def favoriteMovie(*, session: AsyncSession = Depends(get_db), userid: int):
    query = select(Rating, Movie).join(Movie).where(Rating.user_id == userid).order_by(desc(Rating.stars)).order_by(desc(Rating.timestamp)).limit(5)
    result = await session.execute(query)
    print(result)
    ratings = result.scalars().all()
    if not ratings:
        raise HTTPException(status_code=404, detail="Ratings not found")
    # From Ratings to RatingReturn
    ratingList = list_rating_to_list_rating_return(ratings)
    print(ratingList)
    for rating in ratingList:
        query = select(Movie).where(Movie.movieid == rating.movie_id)
        result = await session.execute(query)
        ratingQuery = result.scalars().first()
        rating.titleMovie = ratingQuery.title
        rating.genresMovie = ratingQuery.genres
        rating.imdbidMovie = ratingQuery.imdbid
        rating.yearMovie = ratingQuery.year
        rating.urlMovie = ratingQuery.url

    return ratingList

