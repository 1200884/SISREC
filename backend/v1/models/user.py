from sqlmodel import Field, SQLModel
from typing import Optional
from sqlalchemy import Column, String

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str

class UserCreate(SQLModel):
    name: str
    email: str
    password: str


class UserUpdate(SQLModel):
    name: Optional[str]   
    email: Optional[str]   
    password: Optional[str]

class UserLogin(SQLModel): 
    email: str 
    password: str
