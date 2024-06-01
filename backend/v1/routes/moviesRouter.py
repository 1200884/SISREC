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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter(prefix='/movies', tags=['Movies'])

@router.get("/search/{title}", summary="Search movie")
async def getMovie(*, session: AsyncSession = Depends(get_db), title: str):
    titleAlt = title.lower()
    query = select(Movie).where(Movie.titlelower.contains(titleAlt)).limit(5)
    movies = await session.execute(query)
    allMovies = movies.scalars().all()
    return allMovies

@router.get("/randomMovie", summary="Returns random movie")
async def getRandomMovie(*, session: AsyncSession = Depends(get_db)):
    number = randint(0, 62423)
    print(f" Number that has selected :{number}")
    movie = await session.get(Movie, number)
    return movie

@router.get("/similarMovies/{title}", summary="Returns 5 similar movies")
async def getSimilarMovies(*, title: str):
    script_dir = os.path.dirname(__file__)
    tags_df = pd.read_csv(os.path.join(script_dir, "../utils/tags.csv"))
    movies_df = pd.read_csv(os.path.join(script_dir, "../utils/movies_full.csv"))
    tags_df['tag'] = tags_df['tag'].str.lower()
    
    # Convert all tags to string to avoid TypeError
    tags_df['tag'] = tags_df['tag'].astype(str)
    
    movie_tags = tags_df.groupby('movieId')['tag'].apply(lambda x: ' '.join(x)).reset_index()
    movies = pd.merge(movies_df, movie_tags, on='movieId', how='left')
    movies['tag'] = movies['tag'].fillna('')

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies['tag'])

    indices = pd.DataFrame(movies['title'], index=movies.index).drop_duplicates()
    matching_rows = indices[indices['title'].str.contains(title, case=False, na=False)]
    idx = matching_rows.iloc[0].name
    
    # Compute the cosine similarity between the given movie and all others
    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix)
    
    # Get similarity scores and sort them
    sim_scores = list(enumerate(cosine_sim[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]  # Get the top 5 similar movies
    
    # Get the movie indices of the top 5 similar movies
    movie_indices = [i[0] for i in sim_scores]
    
    # Return the top 5 similar movies
    return movies['title'].iloc[movie_indices].tolist()