import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Implement validation (e.g., check password length, email format)
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password_hash: password, // Assuming password hashing on backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // Handle successful registration (e.g., redirect)
    } catch (error) {
      console.error("Registration error:", error);
      setSnackbarMessage("Registration failed.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      // Handle registration error (e.g., display error message)
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Register Form */}
      <Box
        sx={{
          width: "400px",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "1px solid #FFA726",
          marginTop: "100px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#BF360C", fontWeight: "bold", marginBottom: "20px" }}
        >
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
              borderColor: "#FFA726",
            },
            "& .MuiInputLabel-root": { color: "#9E9E9E" },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7043",
            },
          }}
        />
        <TextField
          label="EMAIL"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleRegister}
          sx={{
            backgroundColor: "#FFA726",
            color: "#FFFFFF",
            fontWeight: "bold",
            marginTop: "20px",
            borderRadius: "30px",
            padding: "12px 0",
            "&:hover": {
              backgroundColor: "#FF7043",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          REGISTER
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}