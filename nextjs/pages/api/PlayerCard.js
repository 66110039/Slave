export default function PlayerCard({ card, isSelected, onSelect }) {
    return (
      <button
        onClick={onSelect}
        style={{
          backgroundColor: isSelected ? 'yellow' : 'lightgray',
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
        }}
      >
        {card}
      </button>
    );
  }
  