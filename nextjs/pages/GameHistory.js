import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const GameHistory = () => {
  const [gameHistory, setGameHistory] = useState([]);

  const fetchGameHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/game/history');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setGameHistory(data);
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFF3E0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Game History
      </Typography>
      <Paper
        sx={{
          width: '90%',
          maxWidth: '800px',
          padding: 4,
          borderRadius: '20px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Grid container spacing={2}>
          {gameHistory.map((entry) => (
            <Grid item xs={12} key={entry.history_id}>
              <Paper
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  backgroundColor: '#FFFDE7',
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6">
                  Game ID: {entry.game_id} | Player ID: {entry.player_id}
                </Typography>
                <Typography variant="body1">
                  Score: {entry.score} | Win: {entry.win ? 'Yes' : 'No'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default GameHistory;
