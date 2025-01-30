import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      <AppBar position="static" sx={{ backgroundColor: "#f8f8f8", px: 2 }}>
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
                  sx={{ color: "#100f0d" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/favorites" style={{ textDecoration: "none", color: "black" }}>
                      Favorites
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/history" style={{ textDecoration: "none", color: "black" }}>
                      Search History
                    </Link>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {loginCheck ? (
            <>
              {/* User Greeting */}
              <Typography variant="body1" sx={{ mr: 2, color: "#100f0d" }}>
                Hey, {auth.getProfile()?.username || "User"}!
              </Typography>

              {/* Logout Button */}
              <Button
                onClick={() => {
                  auth.logout();
                }}
                sx={{
                  color: "#100f0d",
                  "&:hover": { backgroundColor: "#d2e8e4" }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button>
              <Link to="/login" className="text-decoration-none text-black">
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
