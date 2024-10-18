import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardHeader, Divider, CircularProgress } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // Game Icon
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Trophy Icon
import { styled } from '@mui/system'; // Styled component for custom animations

// Styled component for animated game icon
const AnimatedIcon = styled(SportsEsportsIcon)({
  fontSize: 100,
  color: '#FF7043',
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0)' },
  },
});

const GameHistory = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
      <AnimatedIcon />
      <Typography variant="h3" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#E65100' }}>
        Game History
      </Typography>
      <Paper
        sx={{
          width: '90%',
          maxWidth: '800px',
          padding: 4,
          borderRadius: '20px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#FFE0B2',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {gameHistory.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', marginTop: 2 }}>
                No game history found.
              </Typography>
            ) : (
              gameHistory.map((entry) => (
                <Grid item xs={12} key={entry.history_id}>
                  <Card
                    sx={{
                      backgroundColor: '#FFFDE7',
                      borderRadius: '16px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardHeader
                      avatar={<EmojiEventsIcon sx={{ color: entry.win ? '#FFD700' : '#B0BEC5' }} />}
                      title={
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#BF360C' }}>
                          Game ID: {entry.game_id}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="h6" sx={{ color: '#5D4037' }}>
                          Player ID: {entry.player_id}
                        </Typography>
                      }
                      sx={{ marginBottom: 1 }}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Score: {entry.score}
                      </Typography>
                      <Typography variant="body1">
                        Win: {entry.win ? 'Yes' : 'No'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default GameHistory;
