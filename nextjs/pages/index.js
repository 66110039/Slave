// pages/index.js

import React from "react";
import Link from "next/link";
import { Box, Typography, Button, Grid } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ backgroundColor: "#355364", minHeight: "100vh", padding: "20px" }}>
      {/* Header */}
      <Typography variant="h3" sx={{ color: "#fff", textAlign: "center", marginBottom: "40px" }}>
        Slave Card Game Dashboard
      </Typography>

      {/* Navigation Grid */}
      <Grid container spacing={3} justifyContent="center">
        {/* Links to each player page */}
        <Grid item>
          <Link href="/player1" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#ff5e15", minWidth: "200px" }}>
              Go to Player 1 Page
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/player2" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#ff5e15", minWidth: "200px" }}>
              Go to Player 2 Page
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/player3" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#ff5e15", minWidth: "200px" }}>
              Go to Player 3 Page
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/player4" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#ff5e15", minWidth: "200px" }}>
              Go to Player 4 Page
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
