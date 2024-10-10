// frontend/components/Card.js

import React from 'react';

const Card = ({ card, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'inline-block',
                padding: '20px',
                margin: '10px',
                backgroundColor: isSelected ? 'yellow' : '#fff',
                border: '1px solid black',
                cursor: 'pointer',
            }}
        >
            {card}
        </div>
    );
};

export default Card;
