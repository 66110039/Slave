export default function GameStatus({ table, currentTurn }) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3>Table Cards: {table.length > 0 ? table.join(', ') : 'EMPTY'}</h3>
        <h4>Current Turn: Player {currentTurn + 1}</h4>
      </div>
    );
  }
  