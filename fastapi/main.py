### This is all my main.py code 
from fastapi import FastAPI, HTTPException 
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from typing import Union
from database import *
from routes.users import router
from routes.leaderboard import router as leaderboard_router
from typing import List


app = FastAPI()

# Pydantic model to accept new activity data
class PlayerActivityRequest(BaseModel):
    player_id: int
    activity: str

class PlayCardRequest(BaseModel):
    player_id: int
    card: str

class Player:
    def __init__(self, player_id):
        self.id = player_id
        self.cards = []
        self.points = 0
        self.finished = False  # Tracks if the player has run out of cards

class CardGame:
    def __init__(self):
        self.deck = self.create_deck()
        self.players = [Player(i) for i in range(4)]
        self.table = []
        self.finished_players = []  # To track the order of players finishing
        self.global_message = ""  # Global message to broadcast to all players
        self.game_id = None  # Add this line to store game_id
        self.shuffle_deck()
        self.deal_cards()

    def create_deck(self):
        suits = ['h', 'd', 'c', 's']
        ranks = ['03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15']
        deck = [f"{rank}{suit}" for suit in suits for rank in ranks]
        return deck

    def shuffle_deck(self):
        random.shuffle(self.deck)

    def deal_cards(self):
        for player in self.players:
            player.cards = []  # Reset the cards
            player.finished = False  # Reset finished status
        for _ in range(2):  # Deal 13 cards to each player
            for player in self.players:
                if self.deck:  # Check if there are cards left in the deck
                    player.cards.append(self.deck.pop())  # Remove card from deck and give to player

    def reset_game(self):
        self.deck = self.create_deck()  # Create a new deck
        self.shuffle_deck()  # Shuffle it
        self.deal_cards()  # Deal cards again
        self.table = []  # Clear the table
        self.finished_players = []  # Clear the finished players list
        self.global_message = ""  # Clear the global message

game = CardGame()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow all origins or specify your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")

# Suit ranking: 's' > 'h' > 'd' > 'c'
suit_ranking = {'s': 4, 'h': 3, 'd': 2, 'c': 1}

@app.post("/api/start-game")
async def start_game():
    try:
        # Reset the game before starting
        game.reset_game()  # Resets deck, cards, players, and game state
        
        # Clear player points before starting a new game
        for player in game.players:
            player.points = 0  # Reset points for each player
        
        # Insert the game with the status "ongoing"
        game_record = await insert_game(status="ongoing")
        game.game_id = game_record["game_id"]  # Store the game_id in the game instance
        return {"message": "Game started successfully", "game_id": game_record["game_id"], "start_time": game_record["start_time"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/game/state")
async def get_game_state():
    # Construct the game state response from the game instance
    return {
        "players": [{"id": player.id, "cards": player.cards, "points": player.points} for player in game.players],
        "table": game.table,
        "global_message": game.global_message  # Include global message in the state
    }

@app.post("/game/play")
async def play_card(play_card_request: PlayCardRequest):
    player_id = play_card_request.player_id
    card = play_card_request.card

    # Validate if player exists
    if player_id < 0 or player_id >= len(game.players):
        raise HTTPException(status_code=400, detail="Invalid player ID")

    player = game.players[player_id]

    # Validate if player has the card they want to play
    if card not in player.cards:
        raise HTTPException(status_code=400, detail="Player does not have that card")

    # Check if there is a card on the table
    if game.table:
        top_card = game.table[-1]
        top_card_rank = int(top_card[:-1])  # Extract rank from the top card
        top_card_suit = top_card[-1]  # Extract suit from the top card
        player_card_rank = int(card[:-1])   # Extract rank from player's card
        player_card_suit = card[-1]   # Extract suit from player's card

        # Check if the player's card rank is higher than the top card
        if player_card_rank < top_card_rank:
            raise HTTPException(status_code=400, detail="Card must be higher than the card on the table in rank")

        # If ranks are the same, compare by suit based on suit ranking
        elif player_card_rank == top_card_rank:
            if suit_ranking[player_card_suit] <= suit_ranking[top_card_suit]:
                raise HTTPException(status_code=400, detail="Card must be higher than the card on the table in suit")

    # Check if the played card is the highest among all cards (including current player's remaining cards)
    played_card_rank = int(card[:-1])
    played_card_suit = card[-1]

    # Get the highest card based on rank and suit
    all_remaining_cards = [
        (int(c[:-1]), suit_ranking[c[-1]]) for p in game.players for c in p.cards
    ]

    highest_remaining_card = max(all_remaining_cards, key=lambda x: (x[0], x[1]))

    # If the player's card is the highest, clear the table
    if played_card_rank >= highest_remaining_card[0] and suit_ranking[played_card_suit] >= highest_remaining_card[1]:
        player.cards.remove(card)  # Remove the played card from the player's hand
        game.table.append(card)  # Place the card on the table
        game.table = []  # Clear the table

        # Check if the player has run out of cards and hasn't finished yet
        if not player.cards and not player.finished:
            player.finished = True
            game.finished_players.append(player_id)  # Track the order in which players finish

            # Award points based on the finishing order
            if len(game.finished_players) == 1:
                player.points += 10  # First player to finish
            elif len(game.finished_players) == 2:
                player.points += 5   # Second player to finish
            elif len(game.finished_players) == 3:
                player.points += 3   # Third player to finish

        # If three players finished, end the game and reset
        if len(game.finished_players) == 3:
        # Mark the game as completed in the database and set the winner
            winner_id = game.finished_players[0] + 1  # First player to finish is the winner
        
            if game.game_id is None:
                raise HTTPException(status_code=400, detail="Game ID not found. Unable to end the game.")

            await end_game(game_id=game.game_id, winner_id=winner_id)  # Pass game_id and winner_id

            message = {
                "message": f"Player {player_id + 1} played {card}. Game over! Scores: "
                       f"Player {game.finished_players[0] + 1} (10 pts), Player {game.finished_players[1] + 1} (5 pts), "
                       f"Player {game.finished_players[2] + 1} (3 pts).",
                "player_cards": player.cards,
                "table": game.table,
                "reset": "Game will reset now."
            }
            game.global_message = message['message']  # Broadcast final message to all
            return message
        
        message = f"Player {player_id + 1} played {card}. It's the highest card! The table is cleared."
        game.global_message = message  # Update global game message

        return {
            "message": message,
            "player_cards": player.cards,
            "table": game.table
        }

    # If the card is not the highest, just remove it and place it on the table
    player.cards.remove(card)
    game.table.append(card)

    # Check if the player has run out of cards and hasn't finished yet
    if not player.cards and not player.finished:
        player.finished = True
        game.finished_players.append(player_id)  # Track the order in which players finish

        # Award points based on the finishing order
        if len(game.finished_players) == 1:
            player.points += 10  # First player to finish
        elif len(game.finished_players) == 2:
            player.points += 5   # Second player to finish
        elif len(game.finished_players) == 3:
            player.points += 3   # Third player to finish

    # If three players finished, end the game and reset
    if len(game.finished_players) == 3:
         
        game.status = "completed"

        # Collect final scores
        final_scores = [
            {"username": f"Player {p.id + 1}", "score": p.points} for p in game.players
        ]

        # End the game and set the winner
        winner_id = game.finished_players[0] + 1
        await end_game(game_id=game_id, winner_id=winner_id)  # Call end_game with winner_id and game_id
    
        message = {
            "message": f"Player {player_id + 1} played {card}. Game over! Scores: "
                       f"Player {game.finished_players[0] + 1} (10 pts), Player {game.finished_players[1] + 1} (5 pts), "
                       f"Player {game.finished_players[2] + 1} (3 pts).",
            "player_cards": player.cards,
            "table": game.table,
            "reset": "Game will reset now."
        }
        game.global_message = message['message']  # Broadcast final message to all
        return message

    message = f"Player {player_id + 1} played {card}"
    game.global_message = message  # Update global game message

    return {
        "message": message,
        "player_cards": player.cards,
        "table": game.table
    }

@app.get("/api/game/end/{game_id}")
async def get_game_results(game_id: int):
    try:
        # Fetch the game details and winner
        query = """
            SELECT winner_id, end_time, duration FROM games WHERE game_id = :game_id
        """
        game_result = await database.fetch_one(query=query, values={"game_id": game_id})
        if not game_result:
            raise HTTPException(status_code=404, detail="Game not found")

        # Fetch all player scores for the specific game
        scores_query = """
            SELECT player_id, score FROM game_player_scores WHERE game_id = :game_id
        """
        scores = await database.fetch_all(query=scores_query, values={"game_id": game_id})

        # Format the scores for the response
        player_scores = [{"username": f"Player {s['player_id']}", "score": s['score']} for s in scores]

        return {
            "game_id": game_id,
            "winner": {"username": f"Player {game_result['winner_id']}", "score": 10},  # Assuming winner gets 10 points
            "scores": player_scores
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/game/total-scores")
async def get_total_scores():
    try:
        # Fetch all player total scores from the player_scores table
        scores_query = """
            SELECT player_id, total_score FROM player_scores WHERE player_id BETWEEN 1 AND 4
        """
        total_scores = await database.fetch_all(query=scores_query)

        # Format the scores for the response
        player_total_scores = [{"username": f"Player {s['player_id']}", "total_score": s['total_score']} for s in total_scores]

        return {
            "players": player_total_scores
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update player total score and wins when the game ends
async def update_player_total_score_and_wins(player_id: int, score: int, is_winner: bool):
    query = """
    INSERT INTO player_scores (player_id, total_score, total_wins)
    VALUES (:player_id, :score, :wins)
    ON CONFLICT (player_id)
    DO UPDATE SET 
        total_score = player_scores.total_score + :score,
        total_wins = player_scores.total_wins + :wins
    RETURNING player_id, total_score, total_wins
    """
    values = {"player_id": player_id, "score": score, "wins": 1 if is_winner else 0}
    return await database.fetch_one(query=query, values=values)

# Function to insert each player's score for the current game
async def insert_game_player_score(game_id: int, player_id: int, score: int):
    query = """
    INSERT INTO game_player_scores (game_id, player_id, score)
    VALUES (:game_id, :player_id, :score)
    ON CONFLICT (game_id, player_id)
    DO UPDATE SET 
        score = game_player_scores.score + :score
    """
    values = {"game_id": game_id, "player_id": player_id, "score": score}
    await database.execute(query=query, values=values)


@app.get("/api/game/status/{game_id}")
async def get_game_status(game_id: int):
    # If the game is finished, reflect the in-memory status
    if game.finished_players and len(game.finished_players) >= 3:
        return {"status": "completed"}
    
    # Optionally, fetch the game status from the database if needed
    query = "SELECT status FROM games WHERE game_id = :game_id"
    values = {"game_id": game_id}
    game_db_status = await database.fetch_one(query=query, values=values)

    if not game_db_status:
        raise HTTPException(status_code=404, detail="Game not found")

    return {"status": game_db_status["status"]}


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

@app.get("/api/total_games")
async def get_total_games():
    query = "SELECT COUNT(*) AS total_games FROM games"
    result = await database.fetch_one(query=query)
    return {"total_games": result["total_games"]}

@app.get("/api/recent-game")
async def get_recent_game():
    try:
        query = """
        SELECT game_id FROM games
        WHERE status = 'ongoing'
        ORDER BY start_time DESC
        LIMIT 1
        """
        recent_game = await database.fetch_one(query=query)
        if not recent_game:
            raise HTTPException(status_code=404, detail="No ongoing game found")
        
        return {"game_id": recent_game["game_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/end-recent-game")
async def end_recent_game(winner_id: int):
    try:
        # Fetch the most recent ongoing game
        query = """
        SELECT game_id FROM games
        WHERE status = 'ongoing'
        ORDER BY start_time DESC
        LIMIT 1
        """
        recent_game = await database.fetch_one(query=query)
        if not recent_game:
            raise HTTPException(status_code=404, detail="No ongoing game found")

        game_id = recent_game["game_id"]

        # Update the game with the end time and winner_id
        query = """
            UPDATE games
            SET end_time = NOW(), duration = NOW() - start_time, status = 'completed', winner_id = :winner_id
            WHERE game_id = :game_id
            RETURNING game_id, end_time, duration, winner_id
        """
        values = {"game_id": game_id, "winner_id": winner_id}
        result = await database.fetch_one(query=query, values=values)

        # Insert player scores into game_player_scores and update total scores
        for player in game.players:
            await insert_game_player_score(game_id, player.id + 1, player.points)  # Record game score
            await update_player_total_score_and_wins(player.id + 1, player.points, player.id == winner_id - 1)  # Update total score and wins
            await insert_game_history(game_id, player.id + 1, player.points, player.id + 1 == winner_id)


        return {
            "message": "Game ended successfully",
            "game_id": result["game_id"],
            "end_time": result["end_time"],
            "duration": result["duration"],
            "winner_id": result["winner_id"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/top_player")
async def get_top_player():
    query = """
    SELECT player_id, total_score
    FROM player_scores
    ORDER BY total_score DESC
    LIMIT 1
    """
    top_player = await database.fetch_one(query=query)
    if top_player:
        return {"player_id": top_player["player_id"], "total_score": top_player["total_score"]}
    else:
        raise HTTPException(status_code=404, detail="No players found")

@app.get("/api/leaderboard2")
async def get_leaderboard():
    query = """
    SELECT player_id, total_wins, total_score
    FROM player_scores
    ORDER BY total_wins DESC
    """
    leaderboard_records = await database.fetch_all(query=query)
    
    if leaderboard_records:
        leaderboard = [{"player_id": record["player_id"], "total_wins": record["total_wins"], "total_score": record["total_score"]} for record in leaderboard_records]
        return leaderboard
    else:
        raise HTTPException(status_code=404, detail="No leaderboard entries found")

@app.get("/api/game/history")
async def get_game_history():
    query = """
    SELECT gh.history_id, g.game_id, gh.player_id, gh.score, gh.win
    FROM game_history gh
    JOIN games g ON gh.game_id = g.game_id
    ORDER BY g.start_time DESC
    """
    history_records = await database.fetch_all(query=query)

    if history_records:
        history = [
            {
                "history_id": record["history_id"],
                "game_id": record["game_id"],
                "player_id": record["player_id"],
                "score": record["score"],
                "win": record["win"],
            }
            for record in history_records
        ]
        return history
    else:
        raise HTTPException(status_code=404, detail="No game history found")

@app.post("/game/reset")
async def reset_game():
    game.reset_game()  # This resets the game
    return {"message": "Game has been reset!"}

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

if __name__ == "__main__": 
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
