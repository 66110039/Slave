// pages/player3.js
import { useEffect, useState } from 'react';

const Player3 = () => {
    const playerId = 2; // Player 3 has ID 2 (0-indexed)
    const [playerCards, setPlayerCards] = useState([]);
    const [tableCards, setTableCards] = useState([]);

    const fetchGameState = async () => {
        const response = await fetch('http://localhost:8000/game/state');
        const data = await response.json();
        setPlayerCards(data.players[playerId].cards);
        setTableCards(data.table);
    };

    const playCard = async (cardToPlay) => {
        const response = await fetch('http://localhost:8000/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player_id: playerId, card: cardToPlay }),
        });

        if (response.ok) {
            alert('Card played successfully!');
            fetchGameState(); // Refresh game state
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail}`);
        }
    };

    useEffect(() => {
        fetchGameState(); // Fetch game state when the page loads
    }, []);

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px' }}>
            <h1>Player 3's Turn</h1>
            <h2>Your Cards:</h2>
            <div>
                {playerCards.map((card, index) => (
                    <div key={index} style={{ display: 'inline-block', margin: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
                        {card}
                    </div>
                ))}
            </div>
            <h2>Cards on the Table:</h2>
            <div>
                {tableCards.map((card, index) => (
                    <div key={index} style={{ display: 'inline-block', margin: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
                        {card}
                    </div>
                ))}
            </div>
            <button onClick={() => {
                const cardToPlay = prompt("Enter the card you want to play (e.g., '2 of Hearts'):");
                if (playerCards.includes(cardToPlay)) {
                    playCard(cardToPlay);
                } else {
                    alert("You don't have that card!");
                }
            }}>
                Play Card
            </button>
        </div>
    );
};

export default Player3;
