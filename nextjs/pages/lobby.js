import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat'; // Seat icon for visual cue

const seats = [1, 2, 3, 4]; // Define seats

const LobbyPage = () => {
  const handleJoinGame = (seatNumber) => {
    console.log(`Joining Seat ${seatNumber}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFF3E0', // Light pastel orange background
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      {/* Lobby Container */}
      <Box
        sx={{
          width: '80%',
          maxWidth: '900px',
          backgroundColor: '#FFFFFF', // White background for the lobby container
          borderRadius: '24px',
          padding: 5,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', // Soft shadow for subtle lift effect
          border: '1px solid #FFA726', // Accent border in orange
          textAlign: 'center',
        }}
      >
        {/* Header Section */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#BF360C' }}>
          Welcome to the Game Lobby
        </Typography>
        <Typography variant="body1" sx={{ color: '#6D4C41', mb: 5 }}>
          Choose your seat and prepare for the game!
        </Typography>

        {/* Seat Boxes Section */}
        <Grid container spacing={4}>
          {seats.map((seat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  borderRadius: '16px',
                  padding: 3,
                  backgroundColor: '#FFF9C4', // Uniform light yellow for all seats
                  border: index === 3 ? '2px solid #FFA726' : '2px solid #FFA726', // Same border style for all seats
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)', // Soft shadow
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)', // Slight zoom on hover
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
                  },
                }}
              >
                {/* Seat Icon */}
                <EventSeatIcon
                  sx={{
                    fontSize: 50,
                    color: '#FFA726', // Same orange color for all seats
                    marginBottom: 2,
                  }}
                />

                {/* Seat Label */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#BF360C' }}>
                  SEAT {seat}
                </Typography>

                {/* Join Button */}
                <Button
                  variant="contained"
                  onClick={() => handleJoinGame(seat)}
                  sx={{
                    mt: 2,
                    backgroundColor: '#FFA726', // Same button color for all seats
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#FF7043', // Darker orange on hover for all seats
                    },
                  }}
                >
                  Join Game
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Start Game Button */}
        <Box sx={{ marginTop: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#FF7043',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#D84315', // Darker red on hover
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
            onClick={() => console.log('Starting the game...')}
          >
            Start Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LobbyPage;
