import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Medal icon for top players
import StarIcon from '@mui/icons-material/Star'; // Star icon for special ranking

// Sample leaderboard data for 4 players
const leaderboardData = [
  { rank: 1, player: 'Player1', score: 150 },
  { rank: 2, player: 'Player2', score: 140 },
  { rank: 3, player: 'Player3', score: 130 },
  { rank: 4, player: 'Player4', score: 120 }, // Player 4 is part of top 4 players
];

const LeaderBoard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFF3E0', // Light pastel orange background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        position: 'relative',
      }}
    >
      {/* Decorative Top Background Element */}
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

      {/* Header Section with Enhanced Styling */}
      <Box
        sx={{
          display: 'inline-block',
          padding: '20px 40px',
          border: '4px solid #FF7043', // Bold orange border
          borderRadius: '40px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // Larger shadow for emphasis
          background: 'linear-gradient(135deg, #FFD54F, #FF7043)', // Gradient background
          mb: 6,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)', // Scale effect on hover
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#FFFFFF', // White text for better contrast
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)', // Enhanced text shadow
            fontFamily: 'Cursive',
          }}
        >
          🏆 Leaderboard 🏆
        </Typography>
      </Box>

      {/* Leaderboard Container with Styled Border */}
      <Paper
        sx={{
          width: '90%',
          maxWidth: '1000px', // Adjusted max width for 4 players
          padding: 5,
          borderRadius: '30px',
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.3)', // Enhanced shadow for emphasis
          background: 'linear-gradient(120deg, #FFF3E0, #FFCCBC)', // Light gradient background
          border: '3px solid #FF7043', // Prominent accent border
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mb: 6,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)', // Slight hover effect for the container
          },
        }}
      >
        {/* Decorative Bottom Border Element */}
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

        {/* Leaderboard Grid */}
        <Grid container spacing={4}>
          {leaderboardData.map((player, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={6}
                sx={{
                  padding: 4,
                  backgroundColor:
                    player.rank === 1
                      ? '#FFF59D' // Light yellow background for 1st rank
                      : player.rank === 2
                      ? '#FFE082' // Light orange background for 2nd rank
                      : player.rank === 3
                      ? '#FFCC80' // Light peach background for 3rd rank
                      : '#FFFDE7', // Light background for 4th rank
                  border: `3px solid ${player.rank <= 3 ? '#FF7043' : '#FFA726'}`, // Different borders for top 3 vs. 4th place
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                  position: 'relative',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.08)', // Scale up effect on hover
                  },
                }}
              >
                {/* Medal Icon for All Top 4 Players */}
                <EmojiEventsIcon
                  sx={{
                    fontSize: 50,
                    color:
                      player.rank === 1
                        ? '#FFD700' // Gold for 1st place
                        : player.rank === 2
                        ? '#C0C0C0' // Silver for 2nd place
                        : player.rank === 3
                        ? '#CD7F32' // Bronze for 3rd place
                        : '#FF7043', // Orange for 4th place
                    marginBottom: 1,
                  }}
                />

                {/* Player Name and Score */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#BF360C', // Darker orange text
                    marginBottom: 1,
                  }}
                >
                  {player.player}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#6D4C41', // Subtle brown text for scores
                  }}
                >
                  Score: {player.score}
                </Typography>

                {/* Rank Display */}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    marginTop: 2,
                    color: '#9E9E9E', // Gray text for rank
                  }}
                >
                  Rank: {player.rank}
                </Typography>

                {/* Decorative Bottom Border */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '10px',
                    width: '100%',
                    backgroundColor: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#FF7043', // Color by rank
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
