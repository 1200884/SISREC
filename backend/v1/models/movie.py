from sqlmodel import Field, SQLModel, JSON
from typing import Optional, List
from sqlalchemy import Column, String


class Movie(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    movieId: int
    title: str
    titleLower: str
    genres: str
    imdbId: str
    year: int | None = None
    url: str | None = None