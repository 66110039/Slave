import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from 'axios';

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch leaderboard data from the backend API
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/leaderboard');
      const formattedData = response.data.map((entry, index) => ({
        rank: index + 1,
        player: `User ID: ${entry.user_id}`,  // Customize based on your data
        score: entry.highest_score,
      }));
      setLeaderboardData(formattedData);
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
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
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '150px',
          backgroundColor: '#FFA726',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)',
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          display: 'inline-block',
          padding: '20px 40px',
          border: '4px solid #FF7043',
          borderRadius: '40px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(135deg, #FFD54F, #FF7043)',
          mb: 6,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#FFFFFF',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Cursive',
          }}
        >
          🏆 Leaderboard 🏆
        </Typography>
      </Box>

      <Paper
        sx={{
          width: '90%',
          maxWidth: '1000px',
          padding: 5,
          borderRadius: '30px',
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(120deg, #FFF3E0, #FFCCBC)',
          border: '3px solid #FF7043',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mb: 6,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.03)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '15px',
            width: '100%',
            backgroundColor: '#FF7043',
            borderRadius: '0 0 30px 30px',
            opacity: 0.8,
          }}
        />

        <Grid container spacing={4}>
          {leaderboardData.map((player, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={6}
                sx={{
                  padding: 4,
                  backgroundColor:
                    player.rank === 1
                      ? '#FFF59D'
                      : player.rank === 2
                      ? '#FFE082'
                      : player.rank === 3
                      ? '#FFCC80'
                      : '#FFFDE7',
                  border: `3px solid ${player.rank <= 3 ? '#FF7043' : '#FFA726'}`,
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.08)' },
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fontSize: 50,
                    color:
                      player.rank === 1
                        ? '#FFD700'
                        : player.rank === 2
                        ? '#C0C0C0'
                        : player.rank === 3
                        ? '#CD7F32'
                        : '#FF7043',
                    marginBottom: 1,
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', color: '#BF360C', marginBottom: 1 }}
                >
                  {player.player}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6D4C41' }}>
                  Score: {player.score}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ display: 'block', marginTop: 2, color: '#9E9E9E' }}
                >
                  Rank: {player.rank}
                </Typography>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '10px',
                    width: '100%',
                    backgroundColor: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#FF7043',
                    borderRadius: '0 0 20px 20px',
                    opacity: 0.9,
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default LeaderBoard;
