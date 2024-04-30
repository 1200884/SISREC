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
        sql_query = """
            SELECT 
                movieid, 
                title, 
                genres,
                year,
                url,
                COUNT(stars) AS count, 
                AVG(stars) AS mean,
                (
                    (COUNT(stars) / (COUNT(stars) + 1000)) * AVG(stars) +
                    (1000 / (COUNT(stars) + 1000)) * AVG(stars)
                ) AS weighted_rating
            FROM 
                rating a
            JOIN 
                movie b
            ON 
                a.movie_id = b.movieid
            GROUP BY 
                movieid, title, genres, year, url
            ORDER BY 
                weighted_rating DESC
        """

        grouped_df = pd.read_sql_query(sql_query, con=engine)
    
        json_result = grouped_df.head(5).reset_index().to_dict(orient='records')
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
            sql_query = """
                SELECT 
                    movieid, 
                    title, 
                    genres, 
                    year,
                    url,
                    COUNT(stars) AS count, 
                    AVG(stars) AS mean,
                    (
                        (COUNT(stars) / (COUNT(stars) + 1000)) * AVG(stars) +
                        (1000 / (COUNT(stars) + 1000)) * AVG(stars)
                    ) AS weighted_rating
                FROM 
                    rating a
                JOIN 
                    movie b
                ON 
                    a.movie_id = b.movieid
                GROUP BY 
                    movieid, title, genres, year, url
                ORDER BY 
                    weighted_rating DESC
            """

            grouped_df = pd.read_sql_query(sql_query, con=engine)
    
            json_result = grouped_df.head(5).reset_index().to_dict(orient='records')
            json.dump(json_result, file)
    except:
        print("File already exists")
