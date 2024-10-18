import * as React from "react";
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Menu, MenuItem 
} from "@mui/material";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { styled } from "@mui/system";

// Styled button for theme consistency
const StyledButton = styled(Button)({
  color: "#BF360C",
  backgroundColor: "#FFE0B2",
  borderRadius: "12px",
  padding: "8px 16px",
  margin: "0 5px",
  "&:hover": {
    backgroundColor: "#FFD54F",
    transform: "scale(1.05)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  },
});

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Load user from localStorage and update state
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.username) {
        setUser(parsedUser);
      }
    }
  }, [router.asPath]); // Refresh the component on route change

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginSuccess = () => {
    router.replace(router.asPath); // Refresh the page to update navigation bar
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

          <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <Avatar
                  sx={{ marginRight: "10px", cursor: "pointer" }}
                  onClick={handleMenuOpen}
                  alt={user.username}
                  src="/static/images/avatar/1.jpg" // Placeholder image
                />
                <Typography variant="body1" sx={{ color: "#FFF", marginRight: "10px" }}>
                  Welcome, {user.username}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
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
