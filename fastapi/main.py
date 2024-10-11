### This is all my main.py code 
from fastapi import FastAPI, HTTPException 
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from typing import Union
from database import *
from routes.users import router
from routes.leaderboard import router as leaderboard_router

app = FastAPI()

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
        for _ in range(13):  # Deal 13 cards to each player
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

# Database interaction functions
async def create_new_game():
    query = "INSERT INTO games (start_time, status) VALUES (:start_time, :status) RETURNING game_id"
    values = {"start_time": datetime.now(), "status": "ongoing"}
    result = await database.fetch_one(query=query, values=values)
    print(f"New game created with ID: {result['game_id']}")
    return result["game_id"]

async def end_game(game_id, winner_id):
    end_time = datetime.now()
    query = """
        UPDATE games
        SET end_time = :end_time, duration = :duration, status = 'completed', winner_id = :winner_id
        WHERE game_id = :game_id
    """
    values = {
        "end_time": end_time,
        "duration": end_time - game.start_time,
        "winner_id": winner_id,
        "game_id": game_id
    }
    await database.execute(query=query, values=values)
    print(f"Game {game_id} ended and updated in the database.")

async def record_player_performance(game_id, player_id, score, result):
    query = """
        INSERT INTO game_history (game_id, player_id, score, result)
        VALUES (:game_id, :player_id, :score, :result)
    """
    values = {
        "game_id": game_id,
        "player_id": player_id,
        "score": score,
        "result": result
    }
    await database.execute(query=query, values=values)
    print(f"Performance of player {player_id} recorded in game {game_id}.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")

# Suit ranking: 's' > 'h' > 'd' > 'c'
suit_ranking = {'s': 4, 'h': 3, 'd': 2, 'c': 1}

@app.post("/game/start")
async def start_game():
    try:
        game_id = await create_new_game()
        game.reset_game()
        return {"message": f"New game started with game_id {game_id}"}
    except Exception as e:
        print(f"Error starting game: {e}")
        raise HTTPException(status_code=500, detail="Failed to start the game")

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
            message = {
                "message": f"Player {player_id + 1} played {card}. Game over! Scores: "
                           f"Player {game.finished_players[0] + 1} (10 pts), Player {game.finished_players[1] + 1} (5 pts), "
                           f"Player {game.finished_players[2] + 1} (3 pts).",
                "player_cards": player.cards,
                "table": game.table,
                "reset": "Game will reset now."
            }
            game.global_message = message['message']  # Broadcast final message to all
            game.reset_game()  # Reset the game after displaying the final message
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
        message = {
            "message": f"Player {player_id + 1} played {card}. Game over! Scores: "
                       f"Player {game.finished_players[0] + 1} (10 pts), Player {game.finished_players[1] + 1} (5 pts), "
                       f"Player {game.finished_players[2] + 1} (3 pts).",
            "player_cards": player.cards,
            "table": game.table,
            "reset": "Game will reset now."
        }
        game.global_message = message['message']  # Broadcast final message to all
        game.reset_game()  # Reset the game after displaying the final message
        return message

    message = f"Player {player_id + 1} played {card}"
    game.global_message = message  # Update global game message

    return {
        "message": message,
        "player_cards": player.cards,
        "table": game.table
    }

@app.post("/game/end")
async def end_game_endpoint():
    winner_player_id = game.finished_players[0]  # Get the winner's ID
    await end_game(game.game_id, winner_player_id)  # Update the game record

    # Record each player's performance
    for player in game.players:
        result = "win" if player.id == winner_player_id else "lose"
        await record_player_performance(game.game_id, player.id, player.points, result)
    
    return {"message": "Game ended and results recorded"}

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

@app.post("/game/reset")
async def reset_game():
    game.reset_game()
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
