import { useEffect, useState } from 'react';

const Player3 = () => {
    const playerId = 2; // Player 3 has ID 2 (0-indexed)
    const [playerCards, setPlayerCards] = useState([]);
    const [tableCards, setTableCards] = useState([]); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const fetchGameState = async () => {
        try {
            const response = await fetch('http://localhost:8000/game/state');
            const data = await response.json();

            if (data.players && data.players.length > playerId) {
                setPlayerCards(data.players[playerId].cards);
            } else {
                console.error('Player not found in response:', playerId);
            }

            setTableCards(data.table || []);
        } catch (error) {
            console.error('Error fetching game state:', error);
            setErrorMessage('Failed to fetch game state. Please try again.');
        }
    };

    useEffect(() => {
        fetchGameState();
        const intervalId = setInterval(fetchGameState, 5000);
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
    
            if (response.ok) {
                alert('Card played successfully!');
                fetchGameState(); // Refresh game state after playing a card
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.detail}`); // Display error from the backend
            }
        } catch (error) {
            setErrorMessage('Failed to play card. Please try again.');
        }
    };
    

    function Card({ card }) {
        return (
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
                    }} />
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px' }}>
            <h1>Player 3's Turn</h1>
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
        </div>
    );
};

export default Player3;
