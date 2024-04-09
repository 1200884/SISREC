from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from models import *
from database import *
from typing import List

router = APIRouter(prefix='/users', tags=['Users'])

@router.post("/")
async def create_user():
    return {"status": "User Created!"}

@router.get("/")
async def read_users():
    return {"status": "Presented all the users!"}

@router.get("/{user_id}")
async def read_user(user_id:int):
    return {"status": f"Presented the user with id {user_id}!"}


