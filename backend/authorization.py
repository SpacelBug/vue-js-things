from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from pydantic import BaseModel

from typing import Union, Annotated

from passlib.context import CryptContext
from passlib.hash import bcrypt

import jwt
from jwt.exceptions import InvalidTokenError

from datetime import datetime, timedelta, timezone

import sqlalchemy
from sqlalchemy import text

authorization = APIRouter()

db = sqlalchemy.create_engine('sqlite:///database/test_db')

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "c31181814992e0dd00c1cfa4b4f4dae608efba1146d5114dacd1d07f504e7b12"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str


class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@authorization.post("/token")
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:

    try:
        user = db.connect().execute(
            text(f'select * from users where username = "{form_data.username}"')
        ).mappings().one()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if pwd_context.verify(form_data.password, user.get('password_hash')):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


def check_token(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        token_data = jwt.decode(token, SECRET_KEY, ALGORITHM)
        return 'user'
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token check failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


@authorization.get("/user")
async def read_users_me(
        some: str,
        user: Annotated[str, Depends(check_token)]
):
    print('token: ', user)
    print('params: ', some)
    return 'authorizated'
