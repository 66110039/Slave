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
                        {card}
                    </button>
                ))}
            </div>
            {index === currentPlayer && (
                <div>
                    <button onClick={handlePlay}>Play Selected Cards</button>
                    <button onClick={onSurrender}>Surrender</button>
                </div>
            )}
        </div>
    );
};

export default PlayerHand;
