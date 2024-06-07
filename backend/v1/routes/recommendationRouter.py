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
from sklearn.feature_extraction.text import CountVectorizer
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException
from models import *
from database import *
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
async def personalisedContent(*, session: AsyncSession = Depends(get_db), title: str, user_id: int):
    script_dir = os.path.dirname(__file__)
    movies_df = pd.read_csv(os.path.join(script_dir,"../recommender/dataset/small_dataset/movies_full_2.csv"))
    ratings_df = pd.read_csv(os.path.join(script_dir,"../recommender/dataset/small_dataset/ratings.csv"))
    
    def create_weighted_rating_df(movies_df, ratings_df):
        movies_rating_user_df = pd.merge(movies_df, ratings_df, on="movieId", how="inner")

        movies_rating_df = movies_rating_user_df[['movieId', 'title', 'rating', 'genres', 'year', 'url']].groupby(['movieId', 'title', 'genres', 'year', 'url'])['rating'].agg(['count', 'mean']).round(1)
        movies_rating_df.sort_values('count', ascending=False, inplace=True)
        movies_rating_df.rename(columns={'count' : 'Num_ratings', 'mean': 'Average_rating'}, inplace=True)

        C = round(ratings_df['rating'].mean(), 2)
        m = 500
        movies_rating_df['Bayesian_rating'] = (movies_rating_df['Num_ratings'] / (movies_rating_df['Num_ratings'] + m)) * movies_rating_df['Average_rating'] + (m / (movies_rating_df['Num_ratings'] + m)) * C
        movies_rating_df.drop(columns='Average_rating', inplace=True)
        movies_rating_df.sort_values(by='Bayesian_rating', ascending=False, inplace=True)
        movies_rating_df.rename(columns={'Num_ratings' : 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
        movies_rating_df.reset_index(inplace=True)
        movies_rating_df['genres'] = movies_rating_df['genres'].str.split('|')
        return movies_rating_df
    
    def find_movie_indices(df, title):
        df_copy = df.copy()
        df_copy['genres_str'] = df_copy['genres'].apply(lambda x: ' '.join(x))
        count_vect = CountVectorizer()
        genre_matrix = count_vect.fit_transform(df_copy['genres_str'])
        cosine_sim = cosine_similarity(genre_matrix, genre_matrix)
        idx = df_copy.index[df_copy['title'] == title].tolist()[0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        movie_indices = [i[0] for i in sim_scores]
        movie_indices = movie_indices[1:20]
        del df_copy
        return movie_indices

    def recommend_movies(df, movie_indices, preferred_genres=None, disliked_genres=None):
        recommended_movies = []
        for i in movie_indices:
            movie_genres = set(df.loc[i, 'genres'])

            if disliked_genres:
                if movie_genres.intersection(set(disliked_genres)):
                    continue

            if preferred_genres:
                if not movie_genres.intersection(set(preferred_genres)):
                    continue
        
            recommended_movies.append(i)
        
            # Limit the number of recommended movies to 10
            if len(recommended_movies) >= 5:
                break

        recommended_movies_df = df.loc[recommended_movies]
        recommended_movies_df = recommended_movies_df[['title', 'year', 'url', 'count', 'weighted_rating']]
        return recommended_movies_df
    
    df = create_weighted_rating_df(movies_df, ratings_df)

    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    preferred_genres = user.genresLike
    disliked_genres = user.genresDislike
 
    movie_indices_list = find_movie_indices(df, title)
    recommended_movies = recommend_movies(df, movie_indices_list, preferred_genres, disliked_genres).to_dict(orient='records')
    
    return recommended_movies
    
@router.get("/personalizedKnowledge", summary="Get personalized recommendations by knowledge filtering")
async def personalisedknowledge(*, session: AsyncSession = Depends(get_db), user_id: int):
    script_dir = os.path.dirname(__file__)
    movies_df = pd.read_csv(os.path.join(script_dir,"../recommender/dataset/small_dataset/movies_full_2.csv"))
    ratings_df = pd.read_csv(os.path.join(script_dir,"../recommender/dataset/small_dataset/ratings.csv"))
    
    def create_weighted_rating_df(movies_df, ratings_df):
        movies_rating_user_df = pd.merge(movies_df, ratings_df, on="movieId", how="inner")

        movies_rating_df = movies_rating_user_df[['movieId', 'title', 'rating', 'genres', 'year', 'url']].groupby(['movieId', 'title', 'genres', 'year', 'url'])['rating'].agg(['count', 'mean']).round(1)
        movies_rating_df.sort_values('count', ascending=False, inplace=True)
        movies_rating_df.rename(columns={'count' : 'Num_ratings', 'mean': 'Average_rating'}, inplace=True)

        C = round(ratings_df['rating'].mean(), 2)
        m = 500
        movies_rating_df['Bayesian_rating'] = (movies_rating_df['Num_ratings'] / (movies_rating_df['Num_ratings'] + m)) * movies_rating_df['Average_rating'] + (m / (movies_rating_df['Num_ratings'] + m)) * C
        movies_rating_df.drop(columns='Average_rating', inplace=True)
        movies_rating_df.sort_values(by='Bayesian_rating', ascending=False, inplace=True)
        movies_rating_df.rename(columns={'Num_ratings' : 'count', 'Bayesian_rating' : 'weighted_rating'}, inplace=True)
        movies_rating_df.reset_index(inplace=True)
        movies_rating_df['genres'] = movies_rating_df['genres'].str.split('|')
        return movies_rating_df
    
    def recommend_movies_based_on_genres(df, preferred_genres=None, disliked_genres=None):
        df_copy = df.copy()
        recommended_movies_ids = []
        
        for idx, row in df_copy.iterrows():
            movie_genres = set(row['genres'])
            
            # Check if the movie does not have any of the disliked genres
            if disliked_genres:
                if movie_genres.intersection(set(disliked_genres)):
                    continue

            # Check if the movie has any of the preferred genres
            if preferred_genres:
                if not movie_genres.intersection(set(preferred_genres)):
                    continue
            
            # Add the movie to the list of recommendations
            recommended_movies_ids.append(idx)
            
            # Limit the number of recommended movies to 10
            if len(recommended_movies_ids) >= 5:
                break

        recommended_movies_df = df.loc[recommended_movies_ids]
        recommended_movies_df = recommended_movies_df[['title', 'year', 'url', 'count', 'weighted_rating']]

        return recommended_movies_df

    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    preferred_genres = user.genresLike
    disliked_genres = user.genresDislike
    df = create_weighted_rating_df(movies_df, ratings_df)

    recommended_movies_df = recommend_movies_based_on_genres(df, preferred_genres, disliked_genres)
    return recommended_movies_df.to_dict(orient='records')

@router.get("/personalizedHybrid", summary="Get personalized recommendations by hybrid filtering")
async def personalisedHybrid():
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
