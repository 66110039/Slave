// pages/api/play-card.js
import gameState from '/components/gameState';

export default function handler(req, res) {
    try {
        const { playerId, card } = req.body; // Directly access req.body
        console.log("Received request:", playerId, card); // Debug log

        // Check which player's turn it is and update the cards
        if (playerId === 1 && gameState.currentTurn === 1) {
            gameState.player1Cards = gameState.player1Cards.filter((c) => c !== card);
        } else if (playerId === 2 && gameState.currentTurn === 2) {
            gameState.player2Cards = gameState.player2Cards.filter((c) => c !== card);
        } else if (playerId === 3 && gameState.currentTurn === 3) {
            gameState.player3Cards = gameState.player3Cards.filter((c) => c !== card);
        } else if (playerId === 4 && gameState.currentTurn === 4) {
            gameState.player4Cards = gameState.player4Cards.filter((c) => c !== card);
        } else {
            return res.status(400).json({ message: 'Not your turn!' });
        }

        // Add the played card to the table
        gameState.tableCards.push(card);

        // Update to next player's turn (looping after Player 4 back to Player 1)
        gameState.currentTurn = (gameState.currentTurn % 4) + 1;

        // Send back updated game state (updated player's hand, table cards, and whose turn it is)
        res.status(200).json({
            updatedPlayerCards: gameState[`player${playerId}Cards`],
            updatedTableCards: gameState.tableCards,
            currentTurn: gameState.currentTurn,
        });
    } catch (error) {
        console.error('Error in play-card API:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
}
