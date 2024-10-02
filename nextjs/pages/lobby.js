import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const seats = [1, 2, 3, 4]; // Define seats

const LobbyPage = () => {
  const handleJoinGame = (seatNumber) => {
    // Implement logic for joining a game in the specified seat
    console.log(`Joining Seat ${seatNumber}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8', // Light background color for the entire page
        padding: 3,
      }}
    >
      {/* Lobby Container Box */}
      <Box
        sx={{
          width: '80%',
          maxWidth: '800px',
          backgroundColor: '#ffffff', // White background for the lobby box
          borderRadius: '16px',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Soft shadow for clean look
          padding: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#6C9075' }}>
          LOBBY
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {/* Seat Boxes */}
          {seats.map((seat) => (
            <Box
              key={seat}
              sx={{
                border: '1px solid #6C9075',
                borderRadius: '12px',
                width: '160px',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f7fafc',
                padding: 2,
                transition: 'transform 0.2s ease-in-out', // Smooth hover effect
                '&:hover': {
                  transform: 'scale(1.05)', // Slight zoom on hover
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)', // Enhanced shadow on hover
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#009688' }}>
                SEAT {seat}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleJoinGame(seat)}
                sx={{
                  mt: 2,
                  backgroundColor: '#009688',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#00796b',
                  },
                }}
              >
                Join Game
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LobbyPage;
