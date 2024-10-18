import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in by checking local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/"); // Redirect to home if logged in
    }
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setSnackbarMessage("Please fill in both fields.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password_hash: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify(data));

      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Redirect to the homepage after successful login
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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
      <Box
        sx={{
          width: "400px",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "1px solid #FFA726",
        }}
      >
        <PersonIcon
          sx={{
            fontSize: 80,
            color: "#FFA726",
            marginBottom: "20px",
          }}
        />
        <Typography
          variant="h5"
          sx={{ color: "#BF360C", fontWeight: "bold", marginBottom: "20px" }}
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
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
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
          {loading ? "Logging in..." : "LOGIN"}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
