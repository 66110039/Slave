//api/playCard

import gameState from '/components/gameState';

export default function handler(req, res) {
    try {
        const { playerId, card } = req.body;
        console.log("Received request:", playerId, card); // Debug log

        // Validate playerId and card
        if (!playerId || !card) {
            return res.status(400).json({ message: 'Player ID and card are required' });
        }

        const playerKey = `player${playerId}Cards`;

        // Log current player's cards
        console.log(`Card played at ${new Date().toISOString()}: Player ${playerId} played ${card}`);

        // Ensure the card belongs to the player's hand
        if (!gameState[playerKey].includes(card)) {
            console.log(`Card not found in hand: ${card}`);
            return res.status(400).json({ message: 'Card not in hand!' });
        }

        // Ensure it's the correct player's turn
        if (playerId !== gameState.currentTurn) {
            return res.status(400).json({ message: 'Not your turn!' });
        }

        // Remove the card from the player's hand
        gameState[playerKey] = gameState[playerKey].filter((c) => c !== card);

        // Only keep the last card played on the table
        gameState.tableCards = [card];

        // Update to next player's turn (looping after Player 4 back to Player 1)
        gameState.currentTurn = (gameState.currentTurn % 4) + 1;

        if (gameState[playerKey].length === 0) {
            return res.status(200).json({
                message: `Player ${playerId} has won!`,
                winner: playerId,
                gameState, // Optionally return the whole game state
            });
        }

        // Send back updated game state
        res.status(200).json({
            updatedPlayerCards: gameState[playerKey],
            updatedTableCards: gameState.tableCards,
            currentTurn: gameState.currentTurn,
        });

    } catch (error) {
        console.error('Error in play-card API:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
}
