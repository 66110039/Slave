import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './PlayerPage.module.css'; // Ensure this file exists

export default function PlayerPage({ playerId, nextPlayerRoute }) {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [tableCards, setTableCards] = useState([]);
    const [playerTurn, setPlayerTurn] = useState(playerId);
    const [hasWon, setHasWon] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchGameState = async () => {
        try {
            const res = await fetch('/api/game-state');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Game state fetched successfully:", data);
            console.log("Current Turn:", data.currentTurn); // Log current turn
    
            setCards(data[`player${playerId}Cards`]);
            setTableCards(data.tableCards);
            setPlayerTurn(data.currentTurn.toString());
            setHasWon(data[`player${playerId}Cards`].length === 0);
        } catch (error) {
            console.error("An error occurred while fetching the game state:", error);
        }
    };

    useEffect(() => {
        fetchGameState();
    }, []);

    const playCard = async (card) => {
        if (parseInt(playerTurn) === parseInt(playerId)) {
            console.log(`Attempting to play card: ${card}`);
            setLoading(true);
            const res = await fetch('/api/play-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, card }),
            });

            if (res.ok) {
                const data = await res.json();
                setCards(data.updatedPlayerCards);
                setTableCards(data.updatedTableCards);
                setPlayerTurn(data.currentTurn);
                setHasWon((data.updatedPlayerCards || []).length === 0);

                if (data.currentTurn !== playerId) {
                    router.push(nextPlayerRoute);
                }
            } else {
                const errorData = await res.json();
                alert(errorData.message);
            }
            setLoading(false);
        } else {
            alert("It's not your turn!");
        }
    };

    const handleWin = async () => {
        try {
            const res = await fetch('/api/reset-game', { method: 'POST' });
            if (res.ok) {
                alert("Congratulations! You have won!");
                router.push('/'); // Navigate to the homepage or start screen
            } else {
                alert('Failed to reset the game');
            }
        } catch (error) {
            console.error("Error in handleWin:", error);
            alert('Failed to reset the game');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Player {playerId}'s Page</h1>
            <div className={styles.centerTable}>
                {tableCards && tableCards.length > 0 ? (
                    tableCards.map((card, idx) => (
                        <img 
                            key={idx} 
                            src={`/cards/${card}.png`} 
                            alt={card} 
                            className={styles.tableCard} 
                        />
                    ))
                ) : (
                    <p>No cards on the table</p>
                )}
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
                        <div className={styles.cardContainer}>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                cards.map((card, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            playCard(card); 
                                        }} 
                                        className={styles.cardButton}
                                    >
                                        <img 
                                            src={`/cards/${card}.png`} 
                                            alt={card} 
                                            className={styles.cardImage} 
                                        />
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
            <p>Current turn: {playerTurn}</p>
        </div>
    );
}
