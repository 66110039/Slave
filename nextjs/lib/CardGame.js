// lib/CardGame.js
class Player {
    constructor(id) {
        this.id = id;
        this.cards = [];
    }

    sortCards() {
        this.cards.sort(); // Sort the cards, you can modify this for custom sorting logic
    }

    removeCards(selected) {
        this.cards = this.cards.filter(card => !selected.includes(card));
    }
}

class CardUtils {
    static cardConvert(card) {
        // Example logic to convert card representations, e.g., from strings to objects
        // For example, "2H" could be converted to { rank: 2, suit: "H" }
        return { rank: card[0], suit: card[1] }; // Adjust based on your card format
    }

    static cardSort(cards) {
        // Example logic to sort cards
        return cards.sort((a, b) => a.rank - b.rank); // Adjust sorting based on your card structure
    }

    static isValidSelection(selected, table) {
        // Implement validation logic to check if the selected cards can be played
        // For example, check if they follow game rules based on the table cards
        return true; // Replace with actual validation logic
    }
}

class CardGame {
    constructor() {
        this.players = [new Player(0), new Player(1), new Player(2), new Player(3)];
        this.table = [];
        this.deck = this.createDeck();
        this.surrender = [0, 0, 0, 0]; // Track surrender status for players
        this.currentTurn = 0; // Track the current turn
        this.shuffleDeck();
        this.dealCards();
    }

    createDeck() {
        const suits = ['H', 'D', 'C', 'S']; // Hearts, Diamonds, Clubs, Spades
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push(rank + suit);
            }
        }
        return deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; // Swap cards
        }
    }

    dealCards() {
        for (let i = 0; i < 7; i++) { // Deal 7 cards to each player
            this.players.forEach(player => {
                player.cards.push(this.deck.pop());
            });
        }
    }

    findFirstPlayer(card) {
        // Logic to find the first player with a specific card
        return this.players.findIndex(player => player.cards.includes(card));
    }

    compare(selected, table) {
        // Logic to compare selected cards with table cards
        // Implement your comparison logic according to game rules
        // For now, let's just log for demo purposes
        console.log("Comparing selected cards with table cards");
        // Implement your actual comparison logic here
    }
}

export default CardGame;
