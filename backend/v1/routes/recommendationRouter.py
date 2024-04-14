from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import os

router = APIRouter(prefix='/recommendation', tags=['Recomendation'])

@router.get("/nonpersonalized", summary="Get non-personalized recommendations")
async def nonPersonalised():
    script_dir = os.path.dirname(__file__)
    df_rating = pd.read_parquet(os.path.join(script_dir, '../recommender/dataset/ratings.parquet'))
    df_movie = pd.read_parquet(os.path.join(script_dir,'../recommender/dataset/movies.parquet'))

    df_rating = df_rating[['movieId', 'rating']]
    df_movie = df_movie[['movieId', 'title']]

    grouped_df = (
        pd.merge(df_rating, df_movie, on='movieId', copy=False)
        .groupby(['movieId', 'title'])
        .agg(count=('rating', 'count'), mean=('rating', 'mean'))
    )

    m = 1000
    grouped_df['weighted_rating'] = (
        (grouped_df['count'] / (grouped_df['count'] + m)) * grouped_df['mean'] +
        (m / (grouped_df['count'] + m)) * grouped_df['mean'].mean()
    )

    # Classificação e exibição dos resultados
    sorted_df = grouped_df.sort_values(by='weighted_rating', ascending=False)
    
    # Convert DataFrame to JSON format
    json_result = sorted_df.head(5).reset_index().to_dict(orient='records')
    
    return JSONResponse(content=json_result)
