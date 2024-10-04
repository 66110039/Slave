// pages/api/reset-game.js
import gameState from '/components/gameState';

export default function handler(req, res) {
    // Log the reset action
    console.log('Game is being reset');

    // Reset game state
    gameState.player1Cards = ['03h', '04d', '05s'];
    gameState.player2Cards = ['02c', '07d', '08s'];
    gameState.player3Cards = ['09h', '0jh', '0qh'];
    gameState.player4Cards = ['0ah', '0kh', '10d'];
    gameState.tableCards = []; // Clear table
    gameState.currentTurn = 1; // Reset turn to Player 1

    // Send the reset response with updated game state
    res.status(200).json({ message: 'Game reset successful', gameState });
}
