// pages/api/game-state.js
import gameState from '/components/gameState';


export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
        console.log('Game state being sent:', gameState);
        console.log(`Game state requested at ${new Date().toISOString()}`);

        res.status(200).json(gameState);

    } catch (error) {
        console.error(`Error at ${new Date().toISOString()} - Failed to fetch game state:`, error.message);
        res.status(500).json({ message: 'Failed to fetch game state' });
    }
}
