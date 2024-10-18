import * as React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { styled } from "@mui/system"; // For custom styles

// Styled button for theme consistency
const StyledButton = styled(Button)({
  color: "#BF360C",
  backgroundColor: "#FFE0B2",
  borderRadius: "12px",
  padding: "8px 16px",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#FFD54F",
    transform: "scale(1.05)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  },
});

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    try {
      // Check if user is logged in and parse the data from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.username) {
          setUser(parsedUser); // Set user state if valid user data exists
        } else {
          // Clear invalid data if found in localStorage
          console.warn("Invalid user data found. Clearing localStorage.");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user"); // Clear corrupted data
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user from local storage
    setUser(null); // Update state to reflect logout
    router.push("/login"); // Redirect to login page
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#FFA726", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
      >
        <Toolbar sx={{ position: "relative" }}>
          <IconButton onClick={() => router.push("/")} sx={{ color: "#ffffff" }}>
            <HomeIcon fontSize="large" />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              fontFamily: "Prompt",
            }}
          >
            Slave Card Game
          </Typography>

          <Box sx={{ marginLeft: "auto" }}>
            {user ? (
              <>
                <Typography variant="body1" sx={{ color: "#FFF", marginRight: "10px" }}>
                  Welcome, {user.username}
                </Typography>
                <StyledButton onClick={handleLogout}>Logout</StyledButton>
              </>
            ) : (
              <>
                <StyledButton onClick={() => router.push("/register")}>Register</StyledButton>
                <StyledButton onClick={() => router.push("/login")}>Login</StyledButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <main>{children}</main>
    </>
  );
};

export default NavigationLayout;
