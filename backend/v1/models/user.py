from sqlmodel import Field, SQLModel, Column
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str
    #created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    #updated_at: Optional[datetime] = Field(sa_column=Column(onupdate=datetime.utcnow))

class UserCreate(SQLModel):
    name: str
    email: str
    password: str