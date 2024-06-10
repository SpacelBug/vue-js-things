from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from pydantic import BaseModel

from typing import Annotated

from passlib.context import CryptContext

from jwt_bearer import JWTBearer

import sqlalchemy
from sqlalchemy import text

from jwt_token import create_access_token

authorization = APIRouter()

db = sqlalchemy.create_engine('sqlite:///database/test_db')


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
        access_token = create_access_token(data={"sub": user.username})
        return Token(access_token=access_token, token_type="bearer")
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


@authorization.get("/user", dependencies=[Depends(JWTBearer())])
async def read_users_me(some: str):
    return 'authorizated'
