// pages/player1.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Player2Page() {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [tableCards, setTableCards] = useState([]);
    const [playerTurn, setPlayerTurn] = useState(2);

    // Function to fetch the current game state
    const fetchGameState = async () => {
        const res = await fetch('/api/game-state');
        const data = await res.json();
        setCards(data.player2Cards);
        setTableCards(data.tableCards);
        setPlayerTurn(data.currentTurn);
    };

    useEffect(() => {
        fetchGameState(); // Fetch game state when component mounts
    }, []);

    const playCard = async (card) => {
        if (playerTurn === 2) {
            const res = await fetch('/api/play-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: 2, card }),
            });

            if (res.ok) {
                const data = await res.json();
                setCards(data.updatedPlayerCards);
                setTableCards(data.updatedTableCards);
                setPlayerTurn(data.currentTurn);

                // Navigate to the next player page if it's their turn
                if (data.currentTurn === 3) {
                    router.push('/player3');
                }
            } else {
                const errorData = await res.json();
                alert(errorData.message); // Show error if not the player's turn
            }
        } else {
            alert("It's not your turn!");
        }
    };

    return (
        <div>
            <h1>Player 2's Page</h1>
            <h2>Cards on Table:</h2>
            <div>
                {tableCards.map((card, idx) => (
                    <span key={idx}>{card} </span>
                ))}
            </div>

            <h3>Your Cards:</h3>
            {cards.map((card, idx) => (
                <button key={idx} onClick={() => playCard(card)}>
                    {card}
                </button>
            ))}

            <p>Current turn: {playerTurn}</p>
        </div>
    );
}
