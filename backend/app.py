from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import authorization


app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authorization.authorization)


@app.get('/')
def main():
    return 'hello main'
