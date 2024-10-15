import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Button, Avatar, Divider } from '@mui/material'; 
import { useRouter } from 'next/router';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; 
import CelebrationIcon from '@mui/icons-material/Celebration';

const GameEnd = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [winner, setWinner] = useState(null); // State for storing the winner
  const [totalScores, setTotalScores] = useState([]); // State for total scores across games
  const [gameScores, setGameScores] = useState([]); // State for storing the scores for this particular game

  useEffect(() => {
    // Fetch the winner information
    const fetchWinner = async () => {
      try {
        const response = await fetch(`/api/game/end/${gameId}`);
        if (response.ok) {
          const data = await response.json();
          setWinner(data.winner); // Set the winner data
          setGameScores(data.scores);  // Set the scores for this game
        } else {
          console.error('Failed to fetch winner');
        }
      } catch (error) {
        console.error('Error fetching winner:', error);
      }
    };

    // Fetch total scores for all players across games
    const fetchTotalScores = async () => {
      try {
        const response = await fetch(`/api/game/total-scores`);
        if (response.ok) {
          const data = await response.json();
          setTotalScores(data.players); // Set the total scores of all players
        } else {
          console.error('Failed to fetch total scores');
        }
      } catch (error) {
        console.error('Error fetching total scores:', error);
      }
    };

    if (gameId) {
      fetchWinner();
      fetchTotalScores();
    }
  }, [gameId]);

  // Redirect to the lobby page
  const goToLobby = () => {
    router.push('/lobby'); // Navigate to the lobby page
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', // Full screen height
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f7f8fc', 
        padding: 4
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: '#1976d2' }}>
        <CelebrationIcon sx={{ color: '#ffcc00', fontSize: '40px', marginRight: 1 }} /> 
        Game End - Final Results
      </Typography>

      {/* Winner Information */}
      {winner && (
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Avatar sx={{ width: 80, height: 80, margin: '0 auto', backgroundColor: '#ffcc00' }}>
            <EmojiEventsIcon sx={{ fontSize: '50px', color: 'white' }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2, color: '#4caf50' }}>
            Winner: {winner.username} with {winner.score} points!
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ width: '100%', marginBottom: 4 }} />

      {/* Game Scores for this game */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          width: '100%', 
          maxWidth: '600px', 
          backgroundColor: '#ffffff', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2, color: '#3f51b5' }}>
          <SportsEsportsIcon sx={{ fontSize: '30px', marginRight: 1 }} />
          Scores for this game:
        </Typography>

        <List>
          {gameScores.map((player, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>{player.username.charAt(0)}</Avatar>
              <ListItemText 
                primary={`${player.username}: ${player.score} points`} 
                sx={{ fontSize: '1.1rem', color: '#333', textAlign: 'center' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Divider */}
      <Divider sx={{ width: '100%', marginTop: 4, marginBottom: 4 }} />

      {/* Total Scores Across All Games */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          width: '100%', 
          maxWidth: '600px', 
          backgroundColor: '#ffffff', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2, color: '#3f51b5' }}>
          <SportsEsportsIcon sx={{ fontSize: '30px', marginRight: 1 }} />
          Total Scores Across All Games:
        </Typography>

        <List>
          {totalScores.map((player, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>{player.username.charAt(0)}</Avatar>
              <ListItemText 
                primary={`${player.username}: ${player.total_score} total points`} 
                sx={{ fontSize: '1.1rem', color: '#333', textAlign: 'center' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Button to go to Lobby */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToLobby}
          sx={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold' }}
        >
          Go to Lobby
        </Button>
      </Box>
    </Box>
  );
};

export default GameEnd;
