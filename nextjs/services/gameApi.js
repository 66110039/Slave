import axios from 'axios';

// Set the base URL for your FastAPI backend
const API_URL = 'http://localhost:8000'; // Adjust if your FastAPI app runs on a different port

// Function to get the current game state
export const getGameState = async () => {
    const response = await axios.get(`${API_URL}/game-state`);
    return response.data;
};

// Function to play a card
export const playCard = async (playerId, card) => {
    const response = await axios.post(`${API_URL}/play-card`, { player_id: playerId, card });
    return response.data;
};

// Function to reset the game
export const resetGame = async () => {
    const response = await axios.post(`${API_URL}/reset-game`);
    return response.data;
};
