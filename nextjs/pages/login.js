import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5", // Light gray background to balance the theme
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Login Form */}
      <Box
        sx={{
          width: "400px",
          padding: "40px",
          borderRadius: "16px", // Increase border radius for a softer look
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          backgroundColor: "#FFFFFF", // White background for the form
          border: "1px solid #FFA726", // Orange accent border
        }}
      >
        <PersonIcon
          sx={{
            fontSize: 80,
            color: "#FFA726", // Orange tone for the icon
            marginBottom: "20px",
          }}
        />
        <Typography
          variant="h5"
          sx={{ color: "#BF360C", fontWeight: "bold", marginBottom: "20px" }} // Subtle orange color for header text
        >
          LOGIN
        </Typography>
        <TextField
          label="USERNAME"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              borderColor: "#FFA726", // Orange border
            },
            "& .MuiInputLabel-root": { color: "#9E9E9E" }, // Gray label color
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7043", // Darker orange on hover
            },
          }}
        />
        <TextField
          label="PASSWORD"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              borderColor: "#FFA726",
            },
            "& .MuiInputLabel-root": { color: "#9E9E9E" },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7043",
            },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            backgroundColor: "#FFA726", // Primary orange color for button
            color: "#FFFFFF",
            fontWeight: "bold",
            marginTop: "20px",
            borderRadius: "30px",
            padding: "12px 0",
            "&:hover": {
              backgroundColor: "#FF7043", // Darker orange on hover
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          LOGIN
        </Button>
      </Box>
    </Box>
  );
}
