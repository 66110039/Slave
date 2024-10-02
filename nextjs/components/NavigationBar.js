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
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#6C9075" }}>
        <Toolbar>
          <IconButton
            onClick={() => router.push('/')}
            sx={{ color: "#ffffff" }}
          >
            <FunctionsIcon fontSize="large" />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: "22px",
              fontWeight: 500,
              color: "#ffffff",
              fontFamily: "Prompt",
            }}
          >
            {appName}
          </Typography>
          <Button
            color="inherit"
            onClick={() => router.push("/register")}
            sx={{ textTransform: 'none', color: '#ffffff', marginRight: 1 }}
          >
            Register
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push("/login")}
            sx={{ textTransform: 'none', color: '#ffffff' }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

export default NavigationLayout;