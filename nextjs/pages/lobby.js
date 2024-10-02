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
        backgroundColor: '#f9f9f9',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        LOBBY
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '80%',
          flexWrap: 'wrap',
        }}
      >
        {seats.map((seat) => (
          <Box
            key={seat}
            sx={{
              border: '2px solid #009688',
              borderRadius: '8px',
              width: '150px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e0f7fa',
              margin: '10px',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              SEAT {seat}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleJoinGame(seat)}
              sx={{ mt: 2, backgroundColor: '#009688', color: '#ffffff' }}
            >
              Join Game
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LobbyPage;
