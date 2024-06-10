from time import time
from datetime import datetime, timedelta, timezone

from typing import Annotated

from fastapi import Depends, status
from fastapi import HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer

import jwt

from os import environ

oauth2_scheme = OAuth2AuthorizationCodeBearer('/login', '/token', '/refresh')


# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = environ['SECRET_KEY']
ALGORITHM = environ['ALGORITHM']
ACCESS_TOKEN_EXPIRE_MINUTES = timedelta(minutes=int(environ['ACCESS_TOKEN_EXPIRE_MINUTES']))


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + ACCESS_TOKEN_EXPIRE_MINUTES

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_token(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        token_data = jwt.decode(token, SECRET_KEY, ALGORITHM)

        if token_data["exp"] >= time():
            return token_data
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Old token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token check failed",
            headers={"WWW-Authenticate": "Bearer"},
        )