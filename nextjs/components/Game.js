// components/Game.js
import { useEffect, useState } from 'react';
import { basedeck, cardShuffle, cardDeal, cardSort } from '../components/gameLogic';
import PlayerHand from './PlayerHand';

const Game = () => {
    const [players, setPlayers] = useState([[], [], [], []]);
    const [table, setTable] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [surrendered, setSurrendered] = useState([false, false, false, false]);
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        const deck = cardShuffle(basedeck());
        const hands = cardDeal(deck);
        setPlayers(hands.map(hand => cardSort(hand)));
    }, []);

    const handleSurrender = () => {
        setSurrendered((prev) => {
            const newSurrendered = [...prev];
            newSurrendered[currentPlayer] = true;
            return newSurrendered;
        });
        nextTurn();
    };

    const handleWin = (playerIndex) => {
        // Only allow win if the player has no cards left
        if (players[playerIndex].length === 0) {
            setWinners((prev) => [...prev, playerIndex + 1]); // Add the player as winner
            setGameOver(true); // End the game
        }
    };

    const nextTurn = () => {
        // Check for remaining active players
        const activePlayers = surrendered.filter(s => !s).length;

        // If only one player is left who has not surrendered, declare them the winner
        if (activePlayers === 1) {
            const winnerIndex = surrendered.findIndex(s => !s); // Find the remaining player
            setWinners([winnerIndex + 1]); // Declare the remaining player as winner
            setGameOver(true);
            return; // Stop the game
        }

        let nextPlayer = (currentPlayer + 1) % 4;

        // If the next player has surrendered, skip to the next player
        while (surrendered[nextPlayer]) {
            if (nextPlayer === currentPlayer) {
                // All players have surrendered
                setGameOver(true);
                return;
            }
            nextPlayer = (nextPlayer + 1) % 4;
        }

        setCurrentPlayer(nextPlayer); // Proceed to next player
    };

    const handlePlayCards = (selectedCards) => {
        // Update table and player's hand
        setTable(selectedCards);
        setPlayers((prev) => {
            const newHands = [...prev];
            newHands[currentPlayer] = newHands[currentPlayer].filter(card => !selectedCards.includes(card));
            return newHands;
        });

        // Check if the current player has run out of cards after playing
        if (players[currentPlayer].length === 0) {
            // No need to show win buttons state, just allow win check on all players
        }

        nextTurn(); // Move to the next turn
    };

    if (gameOver) {
        return (
            <div>
                <h2>Game Over!</h2>
                {winners.length > 0 
                    ? <h3>Winner(s): {winners.join(', ')}</h3> 
                    : <h3>No Winners, All Players Surrendered!</h3>}
            </div>
        );
    }

    return (
        <div>
            <h1>Slave Game</h1>
            <h2>Current Player: {currentPlayer + 1}</h2>
            <div>
                <h3>Table:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {table.map((card) => {
                        const imageUrl = `/cards/${card}.png`;
                        return (
                            <img 
                                key={card} 
                                src={imageUrl} 
                                alt={card} 
                                style={{
                                    width: '100px',
                                    height: '150px',
                                    margin: '5px'
                                }} 
                            />
                        );
                    })}
                </div>
                {players.map((hand, index) => (
                    <PlayerHand 
                        key={index} 
                        index={index} 
                        hand={hand} 
                        currentPlayer={currentPlayer} 
                        onSurrender={handleSurrender}
                        onPlayCards={handlePlayCards} 
                    />
                ))}
                {/* Show win button for all players, but it only works if they have no cards */}
                {players.map((hand, index) => (
                    <div key={index}>
                        {hand.length === 0 && (
                            <button onClick={() => handleWin(index)}>Win</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Game;
