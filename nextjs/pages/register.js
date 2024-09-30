import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Implement register logic here
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FAF3DD",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#CDE8E5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 40px",
          position: "absolute",
          top: 0,
        }}
      >
        <Typography variant="h4" sx={{ color: "#964B00", fontWeight: "bold" }}>
          SLAVE GAME
        </Typography>
      </Box>

      {/* Register Form */}
      <Box
        sx={{
          width: "400px",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <Typography variant="h5" sx={{ color: "#964B00", fontWeight: "bold", marginBottom: "20px" }}>
          REGISTRATION
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
            },
          }}
        />
        <TextField
          label="CONFIRM PASSWORD"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
            },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{
            backgroundColor: "#A5D8DD",
            color: "#964B00",
            fontWeight: "bold",
            marginTop: "20px",
            borderRadius: "30px",
            padding: "10px 0",
          }}
        >
          REGISTER
        </Button>
      </Box>
    </Box>
  );
}
