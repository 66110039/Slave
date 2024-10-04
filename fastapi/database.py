# database.py

from datetime import datetime, timezone
from databases import Database

# Database connection details
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "postgres"
POSTGRES_HOST = "db"

# Define the async database URL for PostgreSQL
DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

# Create a database connection instance
database = Database(DATABASE_URL)

# Connect to the database
async def connect_db():
    await database.connect()
    print("Database connected")

# Disconnect from the database
async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# Function to insert a new user into the users table (including last_login)
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email, last_login)
    VALUES (:username, :password_hash, :email, :last_login)
    RETURNING user_id, username, password_hash, email, created_at, last_login
    """
    # Set last_login to None initially when inserting a new user
    values = {"username": username, "password_hash": password_hash, "email": email, "last_login": None}
    return await database.fetch_one(query=query, values=values)

# Function to select a user by username from the users table
async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by email and password_hash from the users table
async def get_user_by_email(email: str, password_hash: str):
    query = "SELECT * FROM users WHERE email = :email AND password_hash = :password_hash"
    return await database.fetch_one(query=query, values={"email": email, "password_hash": password_hash})

# Function to update last_login field for a user
async def update_last_login(user_id: int):
    query = """
    UPDATE users
    SET last_login = :last_login
    WHERE user_id = :user_id
    """
    # Use datetime.now with timezone set to UTC
    values = {"last_login": datetime.now(timezone.utc), "user_id": user_id}
    await database.execute(query=query, values=values)
