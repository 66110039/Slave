import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { useRouter } from 'next/router'; // Import the useRouter hook

const seats = [1, 2, 3, 4]; // Define seats

const LobbyPage = () => {
  const router = useRouter(); // Initialize useRouter for navigation
  const [gameId, setGameId] = useState(null); // Store gameId here

  // Fetch the most recent game ID on component mount
  useEffect(() => {
    const fetchRecentGameId = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/recent-game');
        const data = await response.json();
        if (response.ok) {
          setGameId(data.game_id); // Set the recent game ID
        } else {
          console.error('No ongoing game found');
        }
      } catch (error) {
        console.error('Error fetching recent game ID:', error);
      }
    };

    fetchRecentGameId(); // Fetch the recent game ID when the page loads
  }, []);

  // Function to navigate to the player page based on seat number and gameId
  const handleJoinGame = (seatNumber) => {
    if (gameId) {
      const playerUrl = `/player${seatNumber}?gameId=${gameId}`;
      console.log(`Navigating to: ${playerUrl}`);
      router.push(playerUrl); // Navigate to the respective player page with gameId
    } else {
      console.error('Game ID is not available yet.');
    }
  };

  // Function to start the game (this was missing in your code)
  const handleStartGame = async () => {
    try {
      const startResponse = await fetch('http://localhost:8000/api/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (startResponse.ok) {
        const data = await startResponse.json();
        console.log('Game started successfully:', data);
        setGameId(data.game_id); // Store the gameId here

        // Navigate to player1.js page after the game starts successfully
        router.push(`/player1?gameId=${data.game_id}`); // Pass the gameId to the player
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
                  disabled={!gameId} // Disable button until gameId is fetched
                  sx={{
                    mt: 2,
                    backgroundColor: gameId ? '#FFA726' : '#B0BEC5',
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
            onClick={handleStartGame} // Call handleStartGame
          >
            Start Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LobbyPage;
