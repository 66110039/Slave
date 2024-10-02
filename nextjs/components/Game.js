// components/Game.js
import { useEffect, useState } from 'react';
import { basedeck, cardShuffle, cardDeal, cardSort } from '../components/gameLogic';
import PlayerHand from './PlayerHand';

const Game = () => {
    const [players, setPlayers] = useState([[], [], [], []]);
    const [table, setTable] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [surrendered, setSurrendered] = useState([false, false, false, false]);

    useEffect(() => {
        const deck = cardShuffle(basedeck());
        const hands = cardDeal(deck);
        setPlayers(hands.map(hand => cardSort(hand)));
    }, []);

    const handleSurrender = () => {
        setSurrendered((prev) => {
            const newSurrendered = [...prev];
            newSurrendered[currentPlayer] = true;
            return newSurrendered;
        });
        nextTurn();
    };

    const nextTurn = () => {
        const nextPlayer = (currentPlayer + 1) % 4;
        if (!surrendered[nextPlayer]) {
            setCurrentPlayer(nextPlayer);
        } else {
            // Check for game over conditions
            if (surrendered.filter(s => !s).length <= 1) {
                setGameOver(true);
            }
        }
    };

    const handlePlayCards = (selectedCards) => {
        setTable(selectedCards);
        setPlayers((prev) => {
            const newHands = [...prev];
            newHands[currentPlayer] = newHands[currentPlayer].filter(card => !selectedCards.includes(card));
            return newHands;
        });
        nextTurn();
    };

    if (gameOver) {
        return <h2>Game Over!</h2>;
    }

    return (
        <div>
            <h1>Slave Game</h1>
            <h2>Current Player: {currentPlayer + 1}</h2>
            <div>
                <h3>Table: {table.join(', ')}</h3>
                {players.map((hand, index) => (
                    <PlayerHand 
                        key={index} 
                        index={index} 
                        hand={hand} 
                        currentPlayer={currentPlayer} 
                        onSurrender={handleSurrender}
                        onPlayCards={handlePlayCards} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Game;
