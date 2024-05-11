from fastapi import APIRouter
from fastapi.responses import JSONResponse
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
