import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
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
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          position: "absolute",
          top: 0,
        }}
      >
        <Typography variant="h4" sx={{ color: "#964B00", fontWeight: "bold" }}>
          SLAVE GAME
        </Typography>
        <Link href="/register" sx={{ color: "#964B00", fontSize: "16px" }}>
          SIGNUP
        </Link>
      </Box>

      {/* Login Form */}
      <Box
        sx={{
          width: "400px",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <PersonIcon sx={{ fontSize: 80, color: "#A5D8DD", marginBottom: "20px" }} />
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
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            backgroundColor: "#A5D8DD",
            color: "#964B00",
            fontWeight: "bold",
            marginTop: "20px",
            borderRadius: "30px",
            padding: "10px 0",
          }}
        >
          LOGIN
        </Button>
      </Box>
    </Box>
  );
}
