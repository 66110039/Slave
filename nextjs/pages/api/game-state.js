// pages/api/game-state.js
import gameState from '/components/gameState';

export default function handler(req, res) {
    res.status(200).json(gameState);
}
