import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "black" }}>
            FOOD 4 ALL
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2, color: "black" }}
          >
            <MenuIcon />
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
              // <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
    //   <div className="container-lg">
    //     <a className="navbar-brand" href="#">
    //       {" "}
    //       Food 4 All
    //     </a>
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarNavAltMarkup"
    //       aria-controls="navbarNavAltMarkup"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    //       <div className="navbar-nav">
    //         <a className="nav-item nav-link active" href="#">
    //           Home
    //         </a>
    //         <a className="nav-item nav-link" href="#">
    //           Profiles
    //         </a>
    //         <div className="dropdown">
    //           <button
    //             className="nav-item nav-link dropdown-toggle"
    //             type="button"
    //             data-bs-toggle="dropdown"
    //             aria-expanded="false"
    //           >
    //             Options
    //           </button>
    //           <ul className="dropdown-menu">
    //             <li>
    //               <a className="dropdown-item" href="#">
    //                 Recent Searches
    //               </a>
    //             </li>
    //             <li>
    //               <a className="dropdown-item" href="#">
    //                 Favorites
    //               </a>
    //             </li>
    //             <li>
    //               <a className="dropdown-item" href="#">
    //                 Switch User
    //               </a>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //       <div className="d-flex align-items-center">
    //         {loginCheck ? (
    //           <>
    //             {/* Display user's name from the token */}
    //             <span className="me-3">
    //               Hey, {auth.getProfile()?.username || "User"}!
    //             </span>

    //             <button
    //               className="btn btn-outline-secondary"
    //               type="button"
    //               onClick={() => {
    //                 auth.logout();
    //               }}
    //             >
    //               Logout
    //             </button>
    //           </>
    //         ) : (
    //           <button className="btn btn-secondary">
    //             <Link to="/login" className="text-decoration-none text-white">
    //               Login
    //             </Link>
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default Navbar;
