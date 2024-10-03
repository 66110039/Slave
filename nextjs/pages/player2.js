// pages/player2.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Player2Page() {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [tableCards, setTableCards] = useState([]);
    const [playerTurn, setPlayerTurn] = useState(2);
    const [hasWon, setHasWon] = useState(false);
    const [showCards, setShowCards] = useState(false);

    const fetchGameState = async () => {
        const res = await fetch('/api/game-state');
        const data = await res.json();
        setCards(data.player2Cards);
        setTableCards(data.tableCards);
        setPlayerTurn(data.currentTurn);
        setHasWon(data.player2Cards.length === 0);
    };

    useEffect(() => {
        fetchGameState();
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
                setHasWon(data.updatedPlayerCards.length === 0);

                if (data.currentTurn === 3) {
                    router.push('/player3');
                }
            } else {
                const errorData = await res.json();
                alert(errorData.message);
            }
        } else {
            alert("It's not your turn!");
        }
    };

    const handleWin = () => {
        alert("Congratulations! You have won!");
        window.location.reload();
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
            {hasWon ? (
                <div>
                    <h2>You Win!</h2>
                    <button onClick={handleWin}>Declare Victory</button>
                </div>
            ) : (
                <>
                    <button onClick={() => setShowCards(!showCards)}>
                        {showCards ? "Hide Cards" : "Open Cards"}
                    </button>
                    {showCards && (
                        <div>
                            {cards.map((card, idx) => (
                                <button key={idx} onClick={() => playCard(card)}>
                                    {card}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            <p>Current turn: {playerTurn}</p>
        </div>
    );
}
