from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import os
import json

router = APIRouter(prefix='/recommendation', tags=['Recomendation'])

@router.get("/nonpersonalized", summary="Get non-personalized recommendations")
async def nonPersonalised():
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, '../utils/NonPersonalized.json')
    if os.stat(path).st_size == 0:
        df_rating = pd.read_csv(os.path.join(script_dir, '../recommender/dataset/ratings.csv'))
        df_movie = pd.read_csv(os.path.join(script_dir,'../utils/movies_full.csv'))

        df_rating = df_rating[['movieId', 'rating']]
        #df_movie = df_movie[['movieId', 'title']]

        grouped_df = (
            pd.merge(df_rating, df_movie, on='movieId')
            .groupby(['movieId', 'title', 'genres', 'imdbId', 'year', 'url','titleLower'])
            .agg(count=('rating', 'count'), mean=('rating', 'mean'))
        )

        m = 1000
        grouped_df['weighted_rating'] = (
            (grouped_df['count'] / (grouped_df['count'] + m)) * grouped_df['mean'] +
            (m / (grouped_df['count'] + m)) * grouped_df['mean'].mean()
        )

        sorted_df = grouped_df.sort_values(by='weighted_rating', ascending=False)
    
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
            script_dir = os.path.dirname(__file__)
            df_rating = pd.read_csv(os.path.join(script_dir, '../recommender/dataset/ratings.csv'))
            df_movie = pd.read_csv(os.path.join(script_dir,'../utils/movies_full.csv'))

            df_rating = df_rating[['movieId', 'rating']]
            #df_movie = df_movie[['movieId', 'title']]

            grouped_df = (
            pd.merge(df_rating, df_movie, on='movieId')
            .groupby(['movieId', 'title', 'genres', 'imdbId', 'year', 'url','titleLower'])
            .agg(count=('rating', 'count'), mean=('rating', 'mean'))
            )

            m = 1000
            grouped_df['weighted_rating'] = (
            (grouped_df['count'] / (grouped_df['count'] + m)) * grouped_df['mean'] +
            (m / (grouped_df['count'] + m)) * grouped_df['mean'].mean()
            )

            sorted_df = grouped_df.sort_values(by='weighted_rating', ascending=False)
    
            json_result = sorted_df.head(5).reset_index().to_dict(orient='records')
            json.dump(json_result, file)
    except:
        print("File already exists")
