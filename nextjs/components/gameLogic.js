// utils/gameLogic.js
import { useState } from 'react';

const basedeck = () => {
    return [
        '03c', '03d', '03h', '03s', '04c', '04d', '04h', '04s',
        '05c', '05d', '05h', '05s', '06c', '06d', '06h', '06s',
        '07c', '07d', '07h', '07s', '08c', '08d', '08h', '08s',
        '09c', '09d', '09h', '09s', '10c', '10d', '10h', '10s',
        '0jc', '0jd', '0jh', '0js', '0qc', '0qd', '0qh', '0qs',
        '0kc', '0kd', '0kh', '0ks', '0ac', '0ad', '0ah', '0as',
        '02c', '02d', '02h', '02s'
    ];
};

const cardShuffle = (deck) => {
    const shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
};

const cardSort = (cards) => {
    const cardOrder = {
        '03': 3, '04': 4, '05': 5, '06': 6, '07': 7, '08': 8,
        '09': 9, '10': 10, '0j': 11, '0q': 12, '0k': 13, '0a': 14, '02': 15
    };
    return cards.sort((a, b) => {
        const valueA = cardOrder[a.slice(0, 2)] || 0;
        const valueB = cardOrder[b.slice(0, 2)] || 0;
        return valueA - valueB;
    });
};

const cardDeal = (deck) => {
    const hands = [[], [], [], []];
    for (let i = 0; i < Math.floor(deck.length / 4); i++) {
        hands.forEach((hand) => {
            hand.push(deck.pop());
        });
    }
    return hands;
};

const validateSelection = (select, playerHand, table) => {
    // Add your validation logic here (e.g., same rank, max cards)
    return true; // Placeholder, implement actual logic
};

const playerTurnLogic = (currentPlayer, playersHands, table, action) => {
    // Implement the player turn logic (surender or play cards)
};

export { basedeck, cardShuffle, cardSort, cardDeal, validateSelection, playerTurnLogic };
