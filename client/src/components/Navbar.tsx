import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import {Button} from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Switch from '@mui/material/Switch';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  });

  return (
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white"}}>
        <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img 
            src="/logo.jpeg" 
            alt="Food 4 All Logo" 
            style={{ height: "70px" }} 
          />
        </Box>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2, color: "black" }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <div>
           {loginCheck ? (
              <>
                {/* Display user's name from the token */}
               <span className="me-3">
                Hey, {auth.getProfile()?.username || "User"}!
               </span>

                <Button 
                  onClick={() => {
                    auth.logout();
                  }}
                  sx={{ color: "black" }} // Updated color to black
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button>
                <Link to="/login" className="text-decoration-none text-white">
                  Login
                </Link>
              </Button>
            )}
          </div>
            
          </Toolbar>
      </AppBar>
    </Box>

  );
};

export default Navbar;
