from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models import *
import pandas as pd
import os
import json
from sqlalchemy import create_engine
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
import numpy as np
from scipy.sparse import csr_matrix
load_dotenv()

router = APIRouter(prefix='/recommendation', tags=['Recomendation'])
engine = create_engine(os.getenv('DATABASE_URL_FILE'))

@router.get("/nonpersonalized", summary="Get non-personalized recommendations")
async def nonPersonalised():
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, '../utils/NonPersonalized.json')
    if os.stat(path).st_size == 0:
        df = pd.read_sql_query("""SELECT 
            m.movieid,
            m.title,
            m.genres,
            m.imdbid,
            m.year,
            m.url,
            m.titlelower,
            COUNT(r.stars) AS count,
            AVG(r.stars) AS mean
            FROM 
                movie m
            JOIN 
                rating r ON m.movieid = r.movie_id
            GROUP BY 
                m.movieid, m.title, m.genres, m.imdbid, m.year, m.url, m.titlelower""", con=engine)
        m = 1000
        df['weighted_rating'] = ((df['count'] / (df['count'] + m)) * df['mean'] +(m / (df['count'] + m)) * df['mean'].mean())


        sorted_df = df.sort_values(by='weighted_rating', ascending=False)
        json_result = sorted_df.head(5).reset_index().to_dict(orient='records')
        with open(path, "w") as file:
            json.dump(json_result, file)
    
        return JSONResponse(content=json_result)
    else:
        with open(path, "r") as file:
            #return JSONResponse(content=file.read())
            data = json.load(file)
            return data
        
@router.get("/nonpersonalizedGenre/{genre}", summary="Get non-personalized recommendations with genre")
async def nonPersonalisedGenre(genre: str):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    df['genres'] = df['genres'].str.split('|')
    best_movies_for_genres = {}
    genre_df = df[df['genres'].apply(lambda x: genre in x)]
    if not genre_df.empty:
        best_movie = genre_df[['movieId', 'title', 'url', 'count' ,'weighted_rating']].head(5)
        best_movies_for_genres = best_movie.to_dict(orient='records')
    return best_movies_for_genres

@router.get("/nonpersonalizedYear/{year}", summary="Get non-personalized recommendations with year")
async def nonPersonalisedYear(year: int):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    df = df[df['year'] == year]
    movies_year_best = df[['movieId', 'title', 'url', 'count' ,'weighted_rating']].head(5)
    return movies_year_best.to_dict(orient='records')

@router.get("/nonpersonalizedDecade/{decade}", summary="Get non-personalized recommendations with decade")
async def nonPersonalisedDecate(decade: int):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    df = df[df['decade'] == decade]
    movies_decade_best = df[['movieId', 'title', 'url', 'count' ,'weighted_rating']].head(5)
    return movies_decade_best.to_dict(orient='records')

@router.get("/nonpersonalizedOverall", summary="Get non-personalized recommendations overall")
async def nonPersonalisedOverall():
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    movies_overall_best = df[['movieId', 'title', 'url', 'count' ,'weighted_rating']].head(5)
    return movies_overall_best.to_dict(orient='records')

@router.get("/personalizedColaborative/{user_id}", summary="Get personalized recommendations by colaborative filtering")
async def personalisedColaborative(user_id: int):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../recommender/dataset/small_dataset/ratings.csv"))
    df_movies = pd.read_csv(os.path.join(script_dir, "../recommender/dataset/small_dataset/movies_full_2.csv"))
    M = df['userId'].nunique()
    N = df['movieId'].nunique()

    user_mapper = dict(zip(np.unique(df["userId"]), list(range(M))))
    movie_mapper = dict(zip(np.unique(df["movieId"]), list(range(N))))
    
    user_inv_mapper = dict(zip(list(range(M)), np.unique(df["userId"])))
    movie_inv_mapper = dict(zip(list(range(N)), np.unique(df["movieId"])))
    
    user_index = [user_mapper[i] for i in df['userId']]
    item_index = [movie_mapper[i] for i in df['movieId']]

    X = csr_matrix((df["rating"], (user_index,item_index)), shape=(M,N))
    ser_index = user_mapper[user_id]
    similarities = cosine_similarity(X[user_index], X)

    similar_users_indices = similarities.argsort()[0][-5-1:-1][::-1]

    recommended_movies = {}

    for similar_user_index in similar_users_indices:
        unrated_movies = np.where(np.logical_and(X[user_index].toarray()[0] == 0, X[similar_user_index].toarray()[0] != 0))[0]
        
        for movie_index in unrated_movies:
            if movie_index not in recommended_movies:
                recommended_movies[movie_index] = similarities[0, similar_user_index] * X[similar_user_index, movie_index]
            else:
                recommended_movies[movie_index] += similarities[0, similar_user_index] * X[similar_user_index, movie_index]

    recommended_movies = sorted(recommended_movies.items(), key=lambda x: x[1], reverse=True)

    recommended_movie_ids = [movie_inv_mapper[movie_index] for movie_index, _ in recommended_movies]

    recommendations = recommended_movie_ids[:5]

    movie_details = []
    for movie_id in recommendations:
        movie_info = df_movies.loc[movie_id, ['title', 'url', 'genres', 'imdbId', 'year']]
        movie_details.append({
            'title': movie_info['title'],
            'url': movie_info['url'],
            'genres': movie_info['genres'],
            'imdbId': movie_info['imdbId'],
            'year': movie_info['year']
        })
    return movie_details

@router.get("/personalizedContent", summary="Get personalized recommendations by content filtering")
async def personalisedContent():
    return {"message": "Personalized recommendations"}

@router.get("/personalizedHybrid", summary="Get personalized recommendations by hybrid filtering")
async def personalisedContent():
    return {"message": "Personalized recommendations"}

def nonPersonalizedToFile():
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, '../utils/NonPersonalized.json')
    try:
        f = open(path, "x")
        with open(path, "w") as file:
            df = pd.read_sql_query("""SELECT 
            m.movieid,
            m.title,
            m.genres,
            m.imdbid,
            m.year,
            m.url,
            m.titlelower,
            COUNT(r.stars) AS count,
            AVG(r.stars) AS mean
            FROM 
                movie m
            JOIN 
                rating r ON m.movieid = r.movie_id
            GROUP BY 
                m.movieid, m.title, m.genres, m.imdbid, m.year, m.url, m.titlelower""", con=engine)
            m = 1000
            df['weighted_rating'] = ((df['count'] / (df['count'] + m)) * df['mean'] +(m / (df['count'] + m)) * df['mean'].mean())


            sorted_df = df.sort_values(by='weighted_rating', ascending=False)
            json_result = sorted_df.head(5).reset_index().to_dict(orient='records')
            json.dump(json_result, file)
    except:
        print("File already exists")
