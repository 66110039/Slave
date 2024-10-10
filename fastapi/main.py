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
        suits = ['h', 'd', 'c', 's']
        ranks = ['03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15']
        deck = [f"{rank}{suit}" for suit in suits for rank in ranks]
        return deck

    def shuffle_deck(self):
        random.shuffle(self.deck)

    def deal_cards(self):
        for _ in range(13):  # Deal 5 cards to each player
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

    # Check if there is a card on the table
    if game.table:
        top_card = game.table[-1]
        top_card_rank = int(top_card[:-1])  # Extract rank from the top card
        player_card_rank = int(card[:-1])   # Extract rank from player's card

        # Check if the player's card is higher than the top card
        if player_card_rank <= top_card_rank:
            raise HTTPException(status_code=400, detail="Card must be higher than the card on the table")

    # Check if the played card is the highest among all cards (including current player's remaining cards)
    played_card_rank = int(card[:-1])
    all_remaining_cards = [
        int(c[:-1]) for p in game.players for c in p.cards  # Include all players' cards, including the current player
    ]

    # If the player's card is the highest, clear the table
    if all_remaining_cards and played_card_rank >= max(all_remaining_cards):
        player.cards.remove(card)  # Remove the played card from the player's hand
        game.table.append(card)  # Place the card on the table
        game.table = []  # Clear the table

        return {
            "message": f"Player {player_id} played {card}. It's the highest card! The table is cleared.",
            "player_cards": player.cards,
            "table": game.table
        }

    # If the card is not the highest, just remove it and place it on the table
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
