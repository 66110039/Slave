// pages/api/game-state.js
import gameState from '/components/gameState';


export default function handler(req, res) {
    try {
        // Example authorization check (optional)
        // if (!req.session || !req.session.playerId) {
        //     return res.status(403).json({ message: 'Unauthorized access' });
        // }

        // Log the game state request
        console.log('Game state being sent:', gameState); // Log the game state
        console.log(`Game state requested at ${new Date().toISOString()}`); // Timestamp

        // Respond with the current game state
        res.status(200).json(gameState);
    } catch (error) {
        console.error('Error fetching game state:', error); // Log any errors
        res.status(500).json({ message: 'Failed to fetch game state' });
    }
}
