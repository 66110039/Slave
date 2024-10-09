// pages/player2.js
import { useEffect, useState } from 'react';

const Player2 = () => {
    const playerId = 1; // Player 2 has ID 1 (0-indexed)
    const [playerCards, setPlayerCards] = useState([]);
    const [tableCards, setTableCards] = useState([]); // Initialized as an empty array
    const [errorMessage, setErrorMessage] = useState(''); // Track error messages

    const fetchGameState = async () => {
        try {
            const response = await fetch('http://localhost:8000/game/state');
            const data = await response.json();
            console.log('API Response:', data); // Log the entire response
            
            // Check if players exist and assign cards
            if (data.players && data.players.length > playerId) {
                console.log('Player cards:', data.players[playerId].cards); // Log player's cards
                setPlayerCards(data.players[playerId].cards);
            } else {
                console.error('Player not found in response:', playerId);
            }

            // Set table cards
            setTableCards(data.table || []); // Ensure it's an array, fallback to empty array
        } catch (error) {
            console.error('Error fetching game state:', error);
            setErrorMessage('Failed to fetch game state. Please try again.');
        }
    };

    useEffect(() => {
        fetchGameState();
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

            if (response.ok) {
                alert('Card played successfully!');
                fetchGameState(); // Refresh game state after playing a card
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.detail}`);
            }
        } catch (error) {
            setErrorMessage('Failed to play card. Please try again.');
        }
    };

    const Card = ({ card }) => (
        <div
            style={{
                display: 'inline-block',
                margin: '10px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: '#fff',
            }}
        >
            {card}
        </div>
    );

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px' }}>
            <h1>Player 2's Turn</h1>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
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
            <button
                onClick={() => {
                    const cardToPlay = prompt("Enter the card you want to play (e.g., '2 of Hearts'):");
                    if (cardToPlay && playerCards.includes(cardToPlay.trim())) { // Trim input to avoid space issues
                        playCard(cardToPlay.trim());
                    } else {
                        alert("You don't have that card!");
                    }
                }}
            >
                Play Card
            </button>
        </div>
    );
};

export default Player2;
