import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { useRouter } from 'next/router'; // Import the useRouter hook

const seats = [1, 2, 3, 4]; // Define seats

const LobbyPage = () => {
  const router = useRouter(); // Initialize useRouter for navigation

  // Function to navigate to the player page based on seat number
  const handleJoinGame = (seatNumber) => {
    console.log(`Joining Seat ${seatNumber}`);
    router.push(`/player${seatNumber}`); // Navigate to the respective player page
  };

  const handleStartGame = async () => {
    try {
      // First, reset the game before starting
      const resetResponse = await fetch('http://localhost:8000/game/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!resetResponse.ok) {
        console.error('Failed to reset the game', await resetResponse.text());
        return;  // Stop if the game reset fails
      }

      console.log('Game reset successfully');

      // Then, start the game after reset
      const startResponse = await fetch('http://localhost:8000/api/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (startResponse.ok) {
        const data = await startResponse.json();
        console.log('Game started successfully:', data);

        // Navigate to player1.js page after the game starts successfully
        router.push('/player1');
      } else {
        console.error('Failed to start the game', await startResponse.text());
      }
    } catch (error) {
      console.error('Error during start game:', error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFF3E0',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: 5,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          border: '1px solid #FFA726',
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
                  backgroundColor: '#FFF9C4',
                  border: '2px solid #FFA726',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                {/* Seat Icon */}
                <EventSeatIcon
                  sx={{
                    fontSize: 50,
                    color: '#FFA726',
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
                  onClick={() => handleJoinGame(seat)} // Pass seat number to handleJoinGame
                  sx={{
                    mt: 2,
                    backgroundColor: '#FFA726',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#FF7043',
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
                backgroundColor: '#D84315',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LobbyPage;
