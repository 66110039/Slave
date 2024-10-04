let gameState = {
    player1Cards: ['03h', '04d', '05s'],
    player2Cards: ['02c', '07d', '08s'],
    player3Cards: ['09h', '0jh', '0qh'],
    player4Cards: ['0ah', '0kh', '10d'],
    tableCards: ['03s','03c'], // Only the latest card will be stored here
    currentTurn: 1, // It's Player 1's turn
};

// Function to update game state when a player plays a card
export const playCard = (playerId, selectedCards) => {
    const playerKey = `player${playerId}Cards`;
    const playerCards = gameState[playerKey];
    
    // Remove selected cards from the player's hand
    gameState[playerKey] = playerCards.filter(card => !selectedCards.includes(card));
    
    // Only keep the latest card played on the table
    if (selectedCards.length > 0) {
        gameState.tableCards = [selectedCards[selectedCards.length - 1]]; // Store the latest card only
    }
    
    // Check if the player has won
    if (gameState[playerKey].length === 0) {
        console.log(`Player ${playerId} has won!`);
        return { winner: playerId };
    }
    
    // Move to the next player's turn
    gameState.currentTurn = (gameState.currentTurn % 4) + 1;
    
    return gameState;
};

// Function to reset the game state
export const resetGame = () => {
    gameState = {
        player1Cards: ['03h', '04d', '05s'],
        player2Cards: ['02c', '07d', '08s'],
        player3Cards: ['09h', '0jh', '0qh'],
        player4Cards: ['0ah', '0kh', '10d'],
        tableCards: [], // Reset to an empty array
        currentTurn: 1,
    };
    return gameState;
};

export default gameState;
