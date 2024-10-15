import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';

// Static overview data for other cards (placeholders)
const recentActivityData = [
  { player: 'Player2', activity: 'Joined a game', timestamp: '2 hours ago' },
  { player: 'Player3', activity: 'Reached top score', timestamp: '1 day ago' },
  { player: 'Player4', activity: 'Logged in', timestamp: '3 days ago' },
];

const leaderboardData = [
  { player: 'Player1', wins: 50, score: 200 },
  { player: 'Player2', wins: 45, score: 180 },
  { player: 'Player3', wins: 40, score: 170 },
];

const AdminPage = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [recentUsersCount, setRecentUsersCount] = useState(0);
  const [totalGames, setTotalGames] = useState(0); // New state for total games
  const [topPlayer, setTopPlayer] = useState({ player_id: '', total_score: 0 }); // State for top player

  useEffect(() => {
    // Fetch total players from the backend API
    fetch('/api/total_players')
      .then((response) => response.json())
      .then((data) => setTotalPlayers(data.total_players))
      .catch((error) => console.error('Error fetching total players:', error));

    // Fetch recent user count from the backend API
    fetch('/api/recent_users_count')
      .then((response) => response.json())
      .then((data) => setRecentUsersCount(data.recent_users_count))
      .catch((error) => console.error('Error fetching recent user activity:', error));

    // Fetch total games count from the backend API
    fetch('/api/total_games')
      .then((response) => response.json())
      .then((data) => setTotalGames(data.total_games))  // Update totalGames state
      .catch((error) => console.error('Error fetching total games:', error));

    // Fetch top player from the backend API
    fetch('/api/top_player')
      .then((response) => response.json())
      .then((data) => setTopPlayer(data)) // Update top player state
      .catch((error) => console.error('Error fetching top player:', error));
  }, []);

  return (
    <Box sx={{ padding: 6, backgroundColor: '#FFF3E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" sx={{ mb: 6, fontWeight: 'bold', color: '#BF360C', textAlign: 'center' }}>Admin Dashboard</Typography>

      {/* Overview Cards */}
      <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1400px', mb: 6 }}>
        {/* Total Players Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              width: '280px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px',
              backgroundColor: '#FFE0B2',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
              padding: 2,
              margin: '0 auto',
            }}
          >
            <PeopleIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', mt: 1, textAlign: 'center' }}>
              {totalPlayers}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#BF360C', textAlign: 'center' }}>
              Total Users
            </Typography>
          </Paper>
        </Grid>

        {/* Total Games Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              width: '280px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px',
              backgroundColor: '#FFE0B2',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
              padding: 2,
              margin: '0 auto',
            }}
          >
            <SportsEsportsIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', mt: 1, textAlign: 'center' }}>
              {totalGames}  {/* Display total games */}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#BF360C', textAlign: 'center' }}>
              Total Games
            </Typography>
          </Paper>
        </Grid>

        {/* Top Player Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              width: '280px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px',
              backgroundColor: '#FFE0B2',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
              padding: 2,
              margin: '0 auto',
            }}
          >
            <StarIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', mt: 1, textAlign: 'center' }}>
              Player {topPlayer.player_id}  {/* Display top player ID */}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#BF360C', textAlign: 'center' }}>
              Score: {topPlayer.total_score}  {/* Display top player score */}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Activity Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              width: '280px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px',
              backgroundColor: '#FFE0B2',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
              padding: 2,
              margin: '0 auto',
            }}
          >
            <HistoryIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E65100', mt: 1, textAlign: 'center' }}>
              {recentUsersCount} New Players
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#BF360C', textAlign: 'center' }}>
              Register this
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Player Activity Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px', backgroundColor: '#FFE0B2', padding: 4, borderRadius: '16px', mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#BF360C', mb: 3 }}>Recent Player Activity</Typography>
        {recentActivityData.map((activity, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6D4C41' }}>{activity.player}</Typography>
            <Typography variant="body1" sx={{ color: '#5D4037' }}>{activity.activity}</Typography>
            <Typography variant="body2" sx={{ color: '#BF360C' }}>{activity.timestamp}</Typography>
          </Box>
        ))}
      </Box>

      {/* Leaderboard Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <Paper elevation={4} sx={{ padding: 5, borderRadius: '16px', backgroundColor: '#FFE0B2', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#BF360C' }}>Top Players</Typography>
          {leaderboardData.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, borderBottom: index !== leaderboardData.length - 1 ? '1px solid #FF7043' : 'none', '&:hover': { backgroundColor: '#FFF8E1' } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6D4C41' }}>{`${index + 1}. ${entry.player}`}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#6D4C41' }}>Wins: {entry.wins}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#BF360C' }}>Score: {entry.score}</Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPage;
