import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Button } from '@mui/material'; // Import Button from Material UI
import { useRouter } from 'next/router';

const GameEnd = () => {
  const router = useRouter();
  const { gameId } = router.query; // Extract gameId from the URL query parameter
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Fetch the final scores for the game
    const fetchScores = async () => {
      try {
        const response = await fetch(`/api/game/end/${gameId}`);
        if (response.ok) {
          const data = await response.json();
          setScores(data.scores);
        } else {
          console.error('Failed to fetch scores');
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    if (gameId) {
      fetchScores();
    }
  }, [gameId]);

  // Redirect to the lobby page
  const goToLobby = () => {
    router.push('/lobby'); // Navigate to the lobby page
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>
        Game End - Final Scores
      </Typography>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {scores.map((player, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${player.username}: ${player.score} points`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Button to go to Lobby */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToLobby} // Call goToLobby function when clicked
        >
          Go to Lobby
        </Button>
      </Box>
    </Box>
  );
};

export default GameEnd;
