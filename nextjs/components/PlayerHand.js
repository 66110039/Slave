// components/PlayerHand.js
import React, { useState } from 'react';

const PlayerHand = ({ index, hand, currentPlayer, onSurrender, onPlayCards }) => {
    const [selectedCards, setSelectedCards] = useState([]);

    const handleSelectCard = (card) => {
        setSelectedCards((prev) => {
            if (prev.includes(card)) {
                return prev.filter(c => c !== card);
            }
            return [...prev, card];
        });
    };

    const handlePlay = () => {
        if (selectedCards.length > 0) {
            onPlayCards(selectedCards);
            setSelectedCards([]);
        }
    };

    // Check if it's the current player's turn
    if (index !== currentPlayer) {
        return null; // Hide hand if not current player
    }

    return (
        <div>
            <h3>Player {index + 1} Hand:</h3>
            <div>
                {hand.map((card) => (
                    <button 
                        key={card} 
                        onClick={() => handleSelectCard(card)}
                        style={{
                            backgroundColor: selectedCards.includes(card) ? 'lightblue' : 'white',
                            margin: '5px'
                        }}
                    >
                        <img src={`/cards/${card}.png`} alt={card} style={{ width: '100px', height: '150px' }} />
                    </button>
                ))}
            </div>
            <div>
                <button onClick={handlePlay}>Play Selected Cards</button>
                <button onClick={onSurrender}>Surrender</button>
            </div>
        </div>
    );
};

export default PlayerHand;
