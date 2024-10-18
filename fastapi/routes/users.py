import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from database import *  # Ensure your database functions are imported

router = APIRouter()

# Setup basic logging
logging.basicConfig(level=logging.INFO)

# Pydantic model for user creation
class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str

# Pydantic model for user update
class UserUpdate(BaseModel):
    username: Optional[str]
    password_hash: Optional[str]
    email: Optional[str]

# Pydantic model for user response
class User(BaseModel):
    user_id: int
    username: str
    password_hash: str
    email: str
    created_at: datetime
    last_login: Optional[datetime]  # Optional last_login field

# Pydantic model for login
class UserLogin(BaseModel):
    email: str
    password_hash: str

# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    result = await insert_user(user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint to get a user by user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
    result = await update_user(user_id, user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete a user
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint for user login
@router.post("/users/login")
async def login_user(user: UserLogin):
    try:
        db_user = await get_user_by_email(user.email, user.password_hash)
        if db_user is None:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        await update_last_login(db_user["user_id"])

        updated_user = await get_user_by_email(user.email, user.password_hash)

        # Prepare response to include success flag
        response = {
            "user_id": updated_user["user_id"],
            "username": updated_user["username"],
            "email": updated_user["email"],
            "created_at": updated_user["created_at"],
            "last_login": updated_user["last_login"],
            "login_success": True  # Add this to trigger UI updates
        }

        logging.info(f"Login successful for user: {updated_user['username']}")
        return response

    except HTTPException as e:
        logging.warning(f"Login failed: {str(e)}")
        raise e

    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
