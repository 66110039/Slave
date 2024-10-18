import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch leaderboard data from the backend API
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/leaderboard2'); // Use fetch to get data
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const formattedData = data.map((entry, index) => ({
        rank: index + 1,
        player: `Player ${entry.player_id}`, // Use player_id from the database
        totalWins: entry.total_wins,
        totalScore: entry.total_score,
      }));
      setLeaderboardData(formattedData); // Store formatted data in state
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard(); // Fetch leaderboard data on component mount
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
          display: 'inline-block',
          padding: '20px 40px',
          border: '4px solid #FF7043',
          borderRadius: '40px',
          background: 'linear-gradient(135deg, #FFD54F, #FF7043)',
          mb: 6,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
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
          mb: 6,
        }}
      >
        <Grid container spacing={4}>
          {leaderboardData.map((player) => (
            <Grid item xs={12} md={6} key={player.rank}>
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
                  Total Wins: {player.totalWins}
                </Typography>

                <Typography variant="body1" sx={{ color: '#6D4C41' }}>
                  Total Score: {player.totalScore}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ display: 'block', marginTop: 2, color: '#9E9E9E' }}
                >
                  Rank: {player.rank}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default LeaderBoard;
