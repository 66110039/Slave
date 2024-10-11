import { useEffect, useState } from 'react';

const PlayerComponent = ({ playerId, playerName }) => {
    const [playerCards, setPlayerCards] = useState([]);
    const [tableCards, setTableCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [gameMessage, setGameMessage] = useState(''); // Global game message
    const [gameOver, setGameOver] = useState(false); // State to track if the game is over

    const fetchGameState = async () => {
        try {
            const response = await fetch('http://localhost:8000/game/state');
            const data = await response.json();

            // Update the player's cards
            if (data.players && data.players.length > playerId) {
                setPlayerCards(data.players[playerId].cards);
            } else {
                console.error('Player not found in response:', playerId);
            }

            // Update the cards on the table
            setTableCards(data.table || []);

            // Update the game message (this will now apply to all players)
            if (data.global_message) {
                setGameMessage(data.global_message);
            }

            // Check for game-over conditions
            const finishedPlayers = data.players.filter(player => player.finished).length;
            if (finishedPlayers >= 3) {
                setGameMessage("Game over! Resetting...");
                setGameOver(true);
                setTimeout(resetGame, 3000); // Auto reset after 3 seconds
            } else if (finishedPlayers === 1) {
                setGameMessage("Only one player left! Reset the game.");
                setGameOver(true);
            } else {
                setGameOver(false);
            }

        } catch (error) {
            console.error('Error fetching game state:', error);
            setErrorMessage('Failed to fetch game state. Please try again.');
        }
    };

    useEffect(() => {
        fetchGameState();
        const intervalId = setInterval(fetchGameState, 2000); // Poll game state every 2 seconds
        return () => clearInterval(intervalId);
    }, []);

    const playCard = async (cardToPlay) => {
        try {
            const response = await fetch('http://localhost:8000/game/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player_id: playerId, card: cardToPlay }),
            });

            const result = await response.json(); // Get the response message

            if (response.ok) {
                setGameMessage(result.message);  // Display the server's message
                fetchGameState(); // Refresh game state after playing a card
            } else {
                setErrorMessage(`Error: ${result.detail}`); // Display error from the backend
            }
        } catch (error) {
            setErrorMessage('Failed to play card. Please try again.');
        }
    };

    const Card = ({ card }) => (
        <div
            onClick={() => playCard(card)}
            style={{
                display: 'inline-block',
                margin: '10px',
                cursor: 'pointer'
            }}
        >
            <img
                src={`/cards/${card}.png`}
                alt={card}
                style={{
                    width: '100px',
                    borderRadius: '8px'
                }}
            />
        </div>
    );

    const resetGame = async () => {
        try {
            const response = await fetch('http://localhost:8000/game/reset', {
                method: 'POST',
            });
            if (response.ok) {
                setGameMessage('Game has been reset!');
                fetchGameState();  // Fetch the new game state
            }
        } catch (error) {
            console.error('Error resetting game:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px' }}>
            <h1>{playerName}'s Turn</h1>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {gameMessage && <div style={{ color: 'green', fontWeight: 'bold' }}>{gameMessage}</div>} {/* Display the game message */}
            
            <h2>Your Cards:</h2>
            <div>
                {playerCards.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>
            <h2>Cards on the Table:</h2>
            <div>
                {Array.isArray(tableCards) && tableCards.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>
            {/* Show the reset button only if the game is over */}
            {gameOver && (
                <button onClick={resetGame}>Reset Game</button>
            )}
        </div>
    );
};

export default PlayerComponent;
