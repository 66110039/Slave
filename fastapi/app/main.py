from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import math

app = FastAPI()

# Global game state variables
p = [[], [], [], []]
won = []
table = []
deck = []

# Based on your existing game logic
def card_convert(card):
    ncard = []
    for i in range(len(card)):
        new = 0
        if card[i][:2] == '0j':
            new += 11
        elif card[i][:2] == '0q':
            new += 12
        elif card[i][:2] == '0k':
            new += 13
        elif card[i][:2] == '0a':
            new += 14
        elif card[i][:2] == '02':
            new += 15
        else:
            new += float(card[i][:2])
        
        if card[i][-1:] == 'c':
            new += 0.1
        elif card[i][-1:] == 'd':
            new += 0.2
        elif card[i][-1:] == 'h':
            new += 0.3
        elif card[i][-1:] == 's':
            new += 0.4
        ncard.append(new)
    return ncard

def card_rconvert(card):
    ncard = []
    for i in range(len(card)):
        new = '0'
        if int(card[i]) == 11:
            new += 'j'
        elif int(card[i]) == 12:
            new += 'q'
        elif int(card[i]) == 13:
            new += 'k'
        elif int(card[i]) == 14:
            new += 'a'
        elif int(card[i]) == 15:
            new += '2'
        elif int(card[i]) == 10:
            new = '10'
        else:
            new += str(int(card[i]))
        
        if round(card[i] - math.floor(card[i]), 1) == 0.1:
            new += 'c'
        elif round(card[i] - math.floor(card[i]), 1) == 0.2:
            new += 'd'
        elif round(card[i] - math.floor(card[i]), 1) == 0.3:
            new += 'h'
        elif round(card[i] - math.floor(card[i]), 1) == 0.4:
            new += 's'
        ncard.append(new)
    return ncard

def card_sum(arr):
    total = 1
    for i in arr:
        total = i * total * 3
    return total

def compair(select, table):
    if len(select) % 2 != len(table) % 2:
        return False
    vselect = card_convert(select)
    vtable = card_convert(table)
    tvselect = card_sum(vselect)
    tvtable = card_sum(vtable)
    return tvselect > tvtable

def card_deal(deck):
    for _ in range(len(deck) // 4):
        for i in range(4):
            p[i].append(deck.pop(0))
    return p

def basedeck():
    return [
        '03c', '03d', '03h', '03s', '04c', '04d', '04h', '04s', '05c', '05d', 
        '05h', '05s', '06c', '06d', '06h', '06s', '07c', '07d', '07h', '07s', 
        '08c', '08d', '08h', '08s', '09c', '09d', '09h', '09s', '10c', '10d', 
        '10h', '10s', '0jc', '0jd', '0jh', '0js', '0qc', '0qd', '0qh', '0qs', 
        '0kc', '0kd', '0kh', '0ks', '0ac', '0ad', '0ah', '0as', '02c', '02d', 
        '02h', '02s'
    ]

@app.on_event("startup")
def startup_event():
    global deck, p
    deck = basedeck()
    random.shuffle(deck)
    p = card_deal(deck)
    for i in range(4):
        p[i] = sorted(p[i])  # Sort player's cards

@app.get("/game-state")
async def get_game_state():
    return {
        "players": [sorted(p[i]) for i in range(4)],
        "table": table,
        "won": won,
    }

class PlayCardRequest(BaseModel):
    player_id: int
    card: str

@app.post("/play-card")
async def play_card(request: PlayCardRequest):
    global p, table, won
    player_index = request.player_id - 1

    # Check if the card is in player's hand
    if request.card not in p[player_index]:
        raise HTTPException(status_code=400, detail="Card not in hand!")

    # Play the card
    p[player_index].remove(request.card)
    table = [request.card]  # Replace the table cards with the new play

    # Check if the player has won
    if len(p[player_index]) == 0:
        won.append(player_index + 1)  # Store the player who has won

    return {
        "updatedPlayerCards": sorted(p[player_index]),
        "updatedTableCards": table,
        "won": won,
    }

@app.post("/reset-game")
async def reset_game():
    global p, won, table, deck
    deck = basedeck()
    random.shuffle(deck)
    p = card_deal(deck)
    table = []
    won = []
    return {"message": "Game has been reset!"}
