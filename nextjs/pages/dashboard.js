// pages/admin.js

import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const statisticsData = [
  { title: 'Total Players', value: 150, growth: '+20%' },
  { title: 'Games Played', value: 300, growth: '+35%' },
  { title: 'Average Score', value: 85, growth: '+5%' },
  { title: 'Total Wins', value: 120, growth: '+15%' },
];

const leaderboardData = [
  { player: 'Player1', wins: 50 },
  { player: 'Player2', wins: 45 },
  { player: 'Player3', wins: 40 },
  { player: 'Player4', wins: 35 },
  { player: 'Player5', wins: 30 },
];

const AdminPage = () => {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#6C9075' }}>
        Admin Dashboard
      </Typography>

      {/* Statistics Section */}
      <Grid container spacing={4}>
        {statisticsData.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                backgroundColor: '#e0f7fa',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#009688' }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {stat.growth}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Leaderboard Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: '10px',
              backgroundColor: '#e0f7fa',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#009688' }}>
              Leaderboard
            </Typography>
            {leaderboardData.map((entry, index) => (
              <Typography key={index} variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                {`${index + 1}. ${entry.player} - Wins: ${entry.wins}`}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
