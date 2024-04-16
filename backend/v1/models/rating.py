from sqlmodel import Field, SQLModel, JSON
from typing import Optional, List
from sqlalchemy import Column, String


class Rating(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    movie_id: int
    stars: float
    timestamp: int
class RatingCreate(SQLModel):
    user_id: int
    movie_id: int
    stars: float