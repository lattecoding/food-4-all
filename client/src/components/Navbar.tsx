import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import auth from "../utils/auth";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useOutletContext<{ darkMode: boolean; toggleDarkMode: () => void }>();

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: darkMode ? "#121212" : "#f8f8f8", px: 2 }}>
        <Toolbar>
          {/* Left Side: Logo & Hamburger Menu */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img 
              src="/logo.jpeg" 
              alt="Food 4 All Logo" 
              style={{ height: "70px", marginRight: "10px" }} 
            />

            {/* Hamburger Menu */}
            {loginCheck && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="primary"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  sx={{ color: darkMode ? "#d2e8e4" : "#100f0d" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate("/favorites")}>Favorites</MenuItem>
                  <MenuItem onClick={() => navigate("/search-history")}>Search History</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Dark Mode Toggle */}
          <IconButton onClick={toggleDarkMode} sx={{ mx: 2 }}>
            {darkMode ? <LightModeIcon sx={{ color: "#d2e8e4" }} /> : <DarkModeIcon sx={{ color: "#100f0d" }} />}
          </IconButton>

          {loginCheck ? (
            <>
              {/* User Greeting */}
              <Typography variant="body1" sx={{ mr: 2, color: darkMode ? "#d2e8e4" : "#100f0d" }}>
                Hey, {auth.getProfile()?.username || "User"}!
              </Typography>

              {/* Logout Button */}
              <Button
                onClick={() => {
                  auth.logout();
                  navigate("/login");
                }}
                sx={{
                  color: darkMode ? "#d2e8e4" : "#100f0d",
                  "&:hover": { backgroundColor: darkMode ? "#100f0d" : "#d2e8e4" }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button>
              <Link to="/login" className="text-decoration-none" style={{ color: darkMode ? "#d2e8e4" : "#100f0d" }}>
                Login
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
