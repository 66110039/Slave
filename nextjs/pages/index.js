import React from "react";
import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import { useRouter } from "next/router";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Medal icon
import HistoryIcon from "@mui/icons-material/History"; // History icon for Game History
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Fire icon for emphasis
import { styled } from "@mui/system"; // For styling the animated card images
import Image from "next/image"; // Import Image component

// Sample scoreboard data
const sampleScores = [
  { player: "Player1", score: 120 },
  { player: "Player2", score: 110 },
  { player: "Player3", score: 90 },
  { player: "Player4", score: 85 },
];

// Styled component for animated floating card images
const AnimatedCardImage = styled("img")({
  position: "absolute",
  zIndex: 0,
  opacity: 0.8,
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" },
  },
});

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#FFF3E0", // Light pastel background for a softer feel
        padding: 4,
        position: "relative",
      }}
    >
      {/* Hero Section with Image and Text */}
      <Box
        sx={{
          width: "100%",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #FFCC80, #FFA726)", // Soft gradient background
          borderRadius: "20px",
          marginBottom: 4,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Hero Image */}
        <Box
          sx={{
            position: "absolute",
            left: "30px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Image
            src="/cards/game_icon.png" // Replace with your custom icon image path
            alt="Game Icon"
            width={160}
            height={160}
            objectFit="cover"
          />
        </Box>

        {/* Welcome Text with Soft Overlay */}
        <Box
          sx={{
            marginLeft: "220px",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay to separate text
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 12px rgba(0, 0, 0, 0.3)",
              color: "#E65100", // Deep orange color for text
            }}
          >
            Welcome to the Slave Card Game!
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 2, color: "#D84315", fontStyle: "italic" }} // Italic subtitle text
          >
            Show off your skills and be the top player!
          </Typography>
        </Box>
      </Box>

      {/* Main Section */}
      <Paper
        sx={{
          padding: 4,
          textAlign: "center",
          backgroundColor: "#FFE0B2", // Light pastel background for cards section
          borderRadius: "20px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
          width: "85%",
          marginBottom: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Card Images with Floating Animation */}
        <AnimatedCardImage
          src="/cards/0ac.png"
          alt="Ace of Clubs"
          style={{
            width: "100px",
            top: "-30px",
            left: "-40px",
            transform: "rotate(-10deg)",
          }}
        />
        <AnimatedCardImage
          src="/cards/04s.png"
          alt="4 of Spades"
          style={{
            width: "100px",
            top: "-20px",
            right: "-50px",
            transform: "rotate(12deg)",
          }}
        />
        <AnimatedCardImage
          src="/cards/0kc.png"
          alt="King of Clubs"
          style={{
            width: "100px",
            bottom: "-30px",
            left: "-50px",
            transform: "rotate(20deg)",
          }}
        />

        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#BF360C" }}>
          Get Ready to Play!
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 2, color: "#5D4037" }}>
          Challenge your friends and prove who's the best in this exciting card game.
        </Typography>
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#FF7043",
              color: "#ffffff",
              marginRight: 2,
              transition: "all 0.3s ease-in-out",
              borderRadius: "12px",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => router.push("/lobby")}
          >
            Go to Lobby
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "#BF360C",
              borderColor: "#BF360C",
              transition: "all 0.3s ease-in-out",
              borderRadius: "12px",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#BF360C",
                color: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => router.push("/leaderboard")}
          >
            View Leaderboard
          </Button>
        </Box>
      </Paper>

      {/* Feature Highlight Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: 4,
          backgroundColor: "#FFF3E0", // Light pastel background for features
          borderRadius: "20px",
          width: "85%",
          marginTop: 4,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <EmojiEventsIcon sx={{ fontSize: 50, color: "#FFA726" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1, color: "#E65100" }}>
            Real-time Gameplay
          </Typography>
          <Typography variant="body2" sx={{ color: "#5D4037" }}>
            Play against your friends in real-time.
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <HistoryIcon sx={{ fontSize: 50, color: "#FF7043" }} /> {/* New icon for Game History */}
          <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1, color: "#E65100" }}>
            Game History
          </Typography>
          <Typography variant="body2" sx={{ color: "#5D4037" }}>
            Review outcomes of past games and learn from history.
          </Typography>
        </Box>
      </Box>
{/* Enhanced Top Players Section */}
<Box
        sx={{
          display: "inline-block",
          padding: "15px 40px",
          border: "3px solid #FF7043", // Thicker solid border
          borderRadius: "30px",
          background: "linear-gradient(to right, #FFE082, #FFCC80, #FFA726)", // Gradient background for the border
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Stronger shadow for emphasis
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.4)", // Enhanced shadow on hover
          },
          textAlign: "center",
          position: "relative",
          mt: 8, // Additional spacing above Top Players
          mb: 4, // Additional spacing below Top Players
        }}
      >
        {/* Fire Icon for Visual Emphasis */}
        <LocalFireDepartmentIcon
          sx={{
            position: "absolute",
            top: -30,
            left: -30,
            fontSize: 50,
            color: "#FF7043",
            transform: "rotate(45deg)",
            zIndex: 1,
          }}
        />
        {/* Trophy Icon for Top Players Section */}
        <EmojiEventsIcon
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            fontSize: 50,
            color: "#FFD700", // Gold color for the trophy
            zIndex: 1,
          }}
        />
        {/* Text Content with Decorative Border */}
        <Box
          sx={{
            display: "inline-block",
            border: "2px dashed #BF360C", // Dashed border around the text
            borderRadius: "20px",
            padding: "10px 20px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#E65100" }}>
            Top Players
          </Typography>
        </Box>
      </Box>

      {/* Scoreboard Display */}
      <Grid container spacing={4} sx={{ width: "85%" }}>
        {sampleScores.map((score, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                textAlign: "center",
                backgroundColor: "#FFE0B2", // Light warm color for cards
                borderRadius: "12px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                border:
                  index === 0
                    ? "3px solid #FFD700" // Gold for 1st place
                    : index === 1
                    ? "3px solid #C0C0C0" // Silver for 2nd place
                    : index === 2
                    ? "3px solid #CD7F32" // Bronze for 3rd place
                    : "3px solid #FF7043", // Orange for 4th place
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 1,
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fontSize: 40,
                    color:
                      index === 0
                        ? "#FFD700" // Gold for 1st place
                        : index === 1
                        ? "#C0C0C0" // Silver for 2nd place
                        : index === 2
                        ? "#CD7F32" // Bronze for 3rd place
                        : "#FF7043", // Orange for 4th place
                    marginRight: 1,
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#BF360C" }}>
                  {score.player}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ marginTop: 1, color: "#5D4037" }}>
                Score: {score.score}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}