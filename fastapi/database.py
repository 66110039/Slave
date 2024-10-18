from datetime import datetime, timezone
from databases import Database
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

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
    values = {
        "username": username,
        "password_hash": password_hash,
        "email": email,
        "last_login": None
    }
    return await database.fetch_one(query=query, values=values)

# Function to select a user by username from the users table
async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by email and password_hash from the users table
async def get_user_by_email(email: str, password_hash: str):
    query = """
    SELECT user_id, username, email, created_at, last_login 
    FROM users 
    WHERE email = :email AND password_hash = :password_hash
    """
    return await database.fetch_one(query=query, values={"email": email, "password_hash": password_hash})

# Function to update last_login field for a user
async def update_last_login(user_id: int):
    query = """
    UPDATE users
    SET last_login = :last_login
    WHERE user_id = :user_id
    RETURNING last_login
    """
    # Use datetime.now with timezone set to UTC
    values = {"last_login": datetime.now(timezone.utc), "user_id": user_id}
    return await database.fetch_one(query=query, values=values)

# Function to insert a new leaderboard entry
async def insert_leaderboard(user_id: int, total_wins: int, highest_score: int):
    query = """
    INSERT INTO leaderboard (user_id, total_wins, highest_score)
    VALUES (:user_id, :total_wins, :highest_score)
    RETURNING leaderboard_id, user_id, total_wins, highest_score, last_updated
    """
    values = {"user_id": user_id, "total_wins": total_wins, "highest_score": highest_score}
    return await database.fetch_one(query=query, values=values)

# Function to get all leaderboard entries
async def get_all_leaderboard_entries():
    query = "SELECT * FROM leaderboard ORDER BY highest_score DESC"
    return await database.fetch_all(query=query)

# Insert a new game with the start time
async def insert_game(status: str):
    query = """
    INSERT INTO games (start_time, status)
    VALUES (NOW(), :status)
    RETURNING game_id, start_time, status
    """
    values = {"status": status}
    return await database.fetch_one(query=query, values=values)

# Function to update the game status, end time, and winner_id when a game finishes
async def end_game(game_id: int, winner_id: int):
    query = """
    UPDATE games
    SET end_time = NOW(), status = 'completed', winner_id = :winner_id
    WHERE game_id = :game_id
    RETURNING game_id, end_time, status, winner_id
    """
    values = {"game_id": game_id, "winner_id": winner_id}
    return await database.fetch_one(query=query, values=values)

# Function to update player score and total wins
async def update_player_score_and_wins(player_id: int, points: int):
    query = """
    INSERT INTO player_scores (player_id, total_score, total_wins)
    VALUES (:player_id, :points, 1)
    ON CONFLICT (player_id)
    DO UPDATE SET 
        total_score = player_scores.total_score + :points,
        total_wins = player_scores.total_wins + 1
    RETURNING player_id, total_score, total_wins
    """
    values = {"player_id": player_id, "points": points}
    return await database.fetch_one(query=query, values=values)

# Function to insert player score for a specific game
async def insert_game_player_score(game_id: int, player_id: int, score: int):
    query = """
    INSERT INTO game_player_scores (game_id, player_id, score)
    VALUES (:game_id, :player_id, :score)
    """
    values = {"game_id": game_id, "player_id": player_id, "score": score}
    await database.execute(query=query, values=values)

# Function to retrieve player scores ordered by total wins (most wins first)
async def get_leaderboard_by_wins():
    query = """
    SELECT player_id, total_wins, total_score 
    FROM player_scores 
    ORDER BY total_wins DESC
    """
    return await database.fetch_all(query=query)

# Function to insert game history
async def insert_game_history(game_id: int, player_id: int, score: int, win: bool):
    query = """
    INSERT INTO game_history (game_id, player_id, score, win)
    VALUES (:game_id, :player_id, :score, :win)
    RETURNING history_id, game_id, player_id, score, win
    """
    values = {"game_id": game_id, "player_id": player_id, "score": score, "win": win}
    return await database.fetch_one(query=query, values=values)
