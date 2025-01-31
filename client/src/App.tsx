import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";

const App = () => {
  // Load dark mode preference from localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Toggle function for dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", String(!prev));
      return !prev;
    });
  };

  // Define light and dark themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#d2e8e4" : "#38793b",
      },
      background: {
        default: darkMode ? "#100f0d" : "#f8f8f8",
        paper: darkMode ? "#121212" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#f8f8f8" : "#100f0d",
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Outlet context={{ darkMode, toggleDarkMode }} />
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
