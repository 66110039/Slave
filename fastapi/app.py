from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import *
from routes.users import router
from routes.leaderboard import router as leaderboard_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "This app.py"} 

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

