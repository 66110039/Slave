import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home"; // Home icon for navigation
import { styled } from "@mui/system"; // For custom styles

// Styled button for theme consistency
const StyledButton = styled(Button)({
  color: "#BF360C",
  backgroundColor: "#FFE0B2",
  borderRadius: "12px",
  padding: "8px 16px",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#FFD54F", // Hover effect with lighter shade
    transform: "scale(1.05)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  },
});

const NavigationLayout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      {/* Updated AppBar with new background color and styles */}
      <AppBar position="sticky" sx={{ backgroundColor: "#FFA726", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar>
          {/* Home Button with Home Icon */}
          <IconButton onClick={() => router.push('/')} sx={{ color: "#ffffff" }}>
            <HomeIcon fontSize="large" />
          </IconButton>

          {/* Application Name or Logo (Optional) */}
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              fontFamily: "Prompt",
            }}
          >
            Slave Card Game
          </Typography>

          {/* Register and Login Buttons with updated styles */}
          <StyledButton onClick={() => router.push("/register")}>
            Register
          </StyledButton>
          <StyledButton onClick={() => router.push("/login")}>
            Login
          </StyledButton>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <main>{children}</main>
    </>
  );
};

export default NavigationLayout;