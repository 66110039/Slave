# routes/leaderboard.py

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List
from database import *  # Import necessary database functions

router = APIRouter()

# Setup basic logging
logging.basicConfig(level=logging.INFO)

# Pydantic model for leaderboard entry creation
class LeaderboardCreate(BaseModel):
    user_id: int
    total_wins: int
    highest_score: int

# Pydantic model for leaderboard response
class Leaderboard(BaseModel):
    leaderboard_id: int
    user_id: int
    total_wins: int
    highest_score: int
    last_updated: datetime

# Endpoint to create a new leaderboard entry
@router.post("/leaderboard/create", response_model=Leaderboard)
async def create_leaderboard_entry(entry: LeaderboardCreate):
    try:
        # Insert new leaderboard entry
        result = await insert_leaderboard(entry.user_id, entry.total_wins, entry.highest_score)
        if result is None:
            raise HTTPException(status_code=400, detail="Error creating leaderboard entry")
        return result

    except Exception as e:
        logging.error(f"Error creating leaderboard entry: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to get all leaderboard entries
@router.get("/leaderboard", response_model=List[Leaderboard])
async def read_leaderboard():
    query = "SELECT * FROM leaderboard ORDER BY highest_score DESC"
    result = await database.fetch_all(query=query)
    if not result:
        raise HTTPException(status_code=404, detail="No entries found in leaderboard")
    return result