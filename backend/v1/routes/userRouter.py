from fastapi import APIRouter, Depends, HTTPException, Query
from models import *
from database import *
from typing import List
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

router = APIRouter(prefix='/users', tags=['Users'])

@router.post("/", summary="Create a user")
async def createUser(*, session: AsyncSession = Depends(get_db), user: UserCreate):
    query = select(User).where(User.email == user.email)
    user = await session.execute(query)
    if user.scalars().first():
        raise HTTPException(status_code=400, detail="User already exists with this email")
    db_user = User(name=user.name, email=user.email, password=user.password)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

@router.post("/login", summary="Login")
async def loginUser(*, session: AsyncSession = Depends(get_db), user: UserLogin):
    query = select(User).where(User.email == user.email).where(User.password == user.password)
    result = await session.execute(query)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or login credencials are wrong")
    else:
        return {"status": "Verified"}

@router.get("/{user_id}", summary="Get user by id")
async def getUserByID(*, session: AsyncSession = Depends(get_db), user_id: int):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user

@router.patch("/{user_id}", summary="Update a user")
async def update_user(*, session: AsyncSession = Depends(get_db), user_id: int, user: UserUpdate):
    db_user = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    values = user.dict(exclude_unset=True)
    for k, v in values.items():
        setattr(db_user, k, v)

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user


