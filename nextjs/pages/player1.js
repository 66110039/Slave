import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

export default function Player1() {
  // Sample player cards and table cards
  const playerCards = ["3", "5", "7", "9", "K"]; // Replace with actual player cards
  const tableCards = ["3"]; // Cards on the table (replace dynamically)
  const otherPlayers = ["CARDS LEFT", "CARDS LEFT", "CARDS LEFT"]; // Replace with actual remaining cards count

  return (
    <Box
      sx={{
        backgroundColor: "#FAF3DD",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Top Player's Remaining Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Paper
          sx={{
            width: "100px",
            height: "70px",
            backgroundColor: "#A5D8DD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            border: "2px solid #000", // Add border to visualize
          }}
        >
          {otherPlayers[0]}
        </Paper>
      </Box>

      {/* Middle Section: Left, Center, and Right Player Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%", // Full width of the container
          padding: "20px 0", // Padding around the middle section
          border: "2px dashed #FF0000", // Border to visualize the middle section
        }}
      >
        {/* Left Player's Remaining Cards */}
        <Paper
          sx={{
            width: "100px",
            height: "150px",
            backgroundColor: "#A5D8DD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            border: "2px solid #000", // Add border to visualize
          }}
        >
          {otherPlayers[1]}
        </Paper>

        {/* Cards on the Table */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            border: "2px solid #000", // Add border to visualize
          }}
        >
          {/* Cards on the Table */}
          {tableCards.map((card, index) => (
            <Paper
              key={index}
              sx={{
                width: "60px",
                height: "90px",
                backgroundColor: "#A5D8DD",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10px",
                fontSize: "24px",
                fontWeight: "bold",
                border: "1px solid #000", // Add border to visualize
              }}
            >
              {card}
            </Paper>
          ))}
        </Box>

        {/* Right Player's Remaining Cards */}
        <Paper
          sx={{
            width: "100px",
            height: "150px",
            backgroundColor: "#A5D8DD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            border: "2px solid #000", // Add border to visualize
          }}
        >
          {otherPlayers[2]}
        </Paper>
      </Box>

      {/* Player's Cards Area */}
      <Box sx={{ marginTop: "40px", marginBottom: "20px" }}>
        <Typography
          variant="h6"
          sx={{
            color: "#964B00",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          YOUR TURN
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {playerCards.map((card, index) => (
            <Grid item key={index}>
              <Paper
                sx={{
                  width: "60px",
                  height: "90px",
                  backgroundColor: "#A5D8DD",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  border: "1px solid #000", // Add border to visualize
                }}
              >
                {card}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
