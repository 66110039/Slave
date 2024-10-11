from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import *
from routes.users import router
from routes.leaderboard import router as leaderboard_router
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

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

@app.get("/api/total_players")
async def get_total_players():
    query = "SELECT COUNT(*) AS total_players FROM users"
    result = await database.fetch_one(query=query)
    print(f"Total Players from Database: {result['total_players']}")  # Add logging
    return {"total_players": result["total_players"]}

@app.get("/api/recent_users_count")
async def get_recent_users_count():
    from datetime import datetime, timedelta
    # Get the start of the week (Monday)
    start_of_week = datetime.now() - timedelta(days=datetime.now().weekday())
    query = "SELECT COUNT(*) AS recent_users_count FROM users WHERE created_at >= :start_of_week"
    values = {"start_of_week": start_of_week}
    result = await database.fetch_one(query=query, values=values)
    print(f"New Players Count: {result['recent_users_count']}")  # Debugging line
    return {"recent_users_count": result["recent_users_count"]}
