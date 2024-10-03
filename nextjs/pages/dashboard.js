import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';

const overviewData = [
  { title: 'Total Players', value: 150, icon: <PeopleIcon sx={{ fontSize: 60 }} /> },
  { title: 'Games Played', value: 300, icon: <SportsEsportsIcon sx={{ fontSize: 60 }} /> },
  { title: 'Top Player', value: 'Player1', icon: <StarIcon sx={{ fontSize: 60 }} /> },
  { title: 'Recent Activity', value: '5 New Players Joined', icon: <HistoryIcon sx={{ fontSize: 60 }} /> },
];

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
  return (
    <Box
      sx={{
        padding: 6,
        backgroundColor: '#FFF3E0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header Section */}
      <Typography
        variant="h3"
        sx={{
          mb: 6,
          fontWeight: 'bold',
          color: '#BF360C',
          textAlign: 'center',
        }}
      >
        Admin Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1400px', mb: 6 }}>
        {overviewData.map((data) => (
          <Grid item xs={12} sm={6} md={3} key={data.title}>
            <Paper
              elevation={4}
              sx={{
                width: '280px', // Increase width for better alignment
                height: '200px', // Increase height for better alignment
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px',
                backgroundColor: '#FFE0B2',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2, // Add margin to separate icon and text
                }}
              >
                {data.icon}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#E65100',
                  mt: 2,
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                {data.value}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#BF360C',
                  textAlign: 'center',
                }}
              >
                {data.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
          backgroundColor: '#FFE0B2',
          padding: 4,
          borderRadius: '16px',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#BF360C', mb: 3 }}
        >
          Recent Player Activity
        </Typography>
        {recentActivityData.map((activity, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6D4C41' }}>
              {activity.player}
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D4037' }}>
              {activity.activity}
            </Typography>
            <Typography variant="body2" sx={{ color: '#BF360C' }}>
              {activity.timestamp}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Leaderboard Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 5,
            borderRadius: '16px',
            backgroundColor: '#FFE0B2',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#BF360C',
            }}
          >
            Top Players
          </Typography>
          {leaderboardData.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                borderBottom: index !== leaderboardData.length - 1 ? '1px solid #FF7043' : 'none',
                '&:hover': {
                  backgroundColor: '#FFF8E1',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#6D4C41',
                }}
              >
                {`${index + 1}. ${entry.player}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#6D4C41',
                  }}
                >
                  Wins: {entry.wins}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#BF360C',
                  }}
                >
                  Score: {entry.score}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPage;
