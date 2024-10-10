from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

class PlayCardRequest(BaseModel):
    player_id: int
    card: str


class Player:
    def __init__(self, player_id):
        self.id = player_id
        self.cards = []

class CardGame:
    def __init__(self):
        self.deck = self.create_deck()
        self.players = [Player(i) for i in range(4)]
        self.table = []
        self.shuffle_deck()
        self.deal_cards()

    def create_deck(self):
        suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
        ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        deck = [f"{rank} of {suit}" for suit in suits for rank in ranks]
        return deck

    def shuffle_deck(self):
        random.shuffle(self.deck)

    def deal_cards(self):
        for _ in range(5):  # Deal 5 cards to each player
            for player in self.players:
                if self.deck:  # Check if there are cards left in the deck
                    player.cards.append(self.deck.pop())  # Remove card from deck and give to player

game = CardGame()  # Initialize the game only once

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Card Game API!2"} 

@app.get("/")
async def get():
    return HTMLResponse(open("index.html").read())

@app.get("/game/state")
async def get_game_state():
    # Construct the game state response from the game instance
    return {
        "players": [{"id": player.id, "cards": player.cards} for player in game.players],
        "table": game.table
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

    # Remove the card from the player's hand and place it on the table
    player.cards.remove(card)
    game.table.append(card)

    return {
        "message": f"Player {player_id} played {card}",
        "player_cards": player.cards,
        "table": game.table
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
