from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models import *
import pandas as pd
import os
import json
from sqlalchemy import create_engine
from dotenv import load_dotenv
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
        best_movie = genre_df[['movieId', 'title', 'url', 'Num_ratings' ,'Bayesian_rating']].head(5)
        best_movie.rename({'Num_ratings': 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
        best_movies_for_genres = best_movie.to_dict(orient='records')
    return best_movies_for_genres

@router.get("/nonpersonalizedYear/{year}", summary="Get non-personalized recommendations with year")
async def nonPersonalisedYear(year: int):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    df = df[df['year'] == year]
    movies_year_best = df[['movieId', 'title', 'url', 'Num_ratings' ,'Bayesian_rating']].head(5)
    movies_year_best.rename({'Num_ratings': 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
    return movies_year_best.to_dict(orient='records')

@router.get("/nonpersonalizedDecade/{decade}", summary="Get non-personalized recommendations with decade")
async def nonPersonalisedDecate(decade: int):
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    df = df[df['decade'] == decade]
    movies_decade_best = df[['movieId', 'title', 'url', 'Num_ratings' ,'Bayesian_rating']].head(5)
    movies_decade_best.rename({'Num_ratings': 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
    return movies_decade_best.to_dict(orient='records')

@router.get("/nonpersonalizedOverall", summary="Get non-personalized recommendations overall")
async def nonPersonalisedOverall():
    script_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(script_dir, "../utils/small_dataset/movies_rating.csv"))
    movies_overall_best = df[['movieId', 'title', 'url', 'Num_ratings' ,'Bayesian_rating']].head(5)
    movies_overall_best.rename({'Num_ratings': 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
    return movies_overall_best.to_dict(orient='records')

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
