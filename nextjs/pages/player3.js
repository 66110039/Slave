import React, { useState } from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";

export default function Player3() {
  const [playerCards, setPlayerCards] = useState(["09c", "06h", "10s"]); // Replace with actual player cards

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#355364", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#fff", textAlign: "center" }}>
        Player 3's Page
      </Typography>

      {/* Display Player's Cards */}
      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {playerCards.map((card, index) => (
          <Grid item key={index}>
            <Paper sx={{ padding: "10px", textAlign: "center" }}>
              <Typography variant="h5">{card}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Play Area */}
      <Box sx={{ marginTop: "40px" }}>
        <Typography variant="h6" sx={{ color: "#fff" }}>Cards on the Table:</Typography>
        {/* Display the cards currently on the table */}
        <Paper sx={{ padding: "20px", marginTop: "10px" }}>
          {/* Replace with actual table cards */}
          <Typography variant="h5">09c, 10s</Typography>
        </Paper>
      </Box>

      {/* Controls for Playing or Skipping */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <Button variant="contained" sx={{ margin: "0 10px" }}>
          Play Selected Cards
        </Button>
        <Button variant="contained" sx={{ margin: "0 10px" }}>
          Surrender
        </Button>
        <Button variant="contained" sx={{ margin: "0 10px" }}>
          Skip Turn
        </Button>
      </Box>
    </Box>
  );
}
