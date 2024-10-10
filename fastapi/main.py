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
        self.points = 0
        self.finished = False  # Tracks if the player has run out of cards

class CardGame:
    def __init__(self):
        self.deck = self.create_deck()
        self.players = [Player(i) for i in range(4)]
        self.table = []
        self.finished_players = []  # To track the order of players finishing
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


game = CardGame()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/game/state")
async def get_game_state():
    # Construct the game state response from the game instance
    return {
        "players": [{"id": player.id, "cards": player.cards, "points": player.points} for player in game.players],
        "table": game.table
    }
# Suit ranking: 's' > 'h' > 'd' > 'c'
suit_ranking = {'s': 4, 'h': 3, 'd': 2, 'c': 1}

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
                "message": f"Player {player_id} played {card}. Game over! Scores: "
                           f"Player {game.finished_players[0]} (10 pts), Player {game.finished_players[1]} (5 pts), "
                           f"Player {game.finished_players[2]} (3 pts).",
                "player_cards": player.cards,
                "table": game.table,
                "reset": "Game will reset now."
            }
            game.reset_game()  # Reset the game after displaying the final message
            return message

        return {
            "message": f"Player {player_id} played {card}. It's the highest card! The table is cleared.",
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
            "message": f"Player {player_id} played {card}. Game over! Scores: "
                       f"Player {game.finished_players[0]} (10 pts), Player {game.finished_players[1]} (5 pts), "
                       f"Player {game.finished_players[2]} (3 pts).",
            "player_cards": player.cards,
            "table": game.table,
            "reset": "Game will reset now."
        }
        game.reset_game()  # Reset the game after displaying the final message
        return message

    return {
        "message": f"Player {player_id} played {card}",
        "player_cards": player.cards,
        "table": game.table
    }

@app.post("/game/reset")
async def reset_game():
    game.reset_game()
    return {"message": "Game has been reset!"}


if __name__ == "__main__": 
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
