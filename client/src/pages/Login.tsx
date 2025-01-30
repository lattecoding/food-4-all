import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Divider, Paper } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginData.username || !loginData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const token = await login({
        username: loginData.username,
        password: loginData.password,
      });

      Auth.login(token);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#d2e8e4", // Soft green background
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: 400,
          textAlign: "center",
          bgcolor: "#f8f8f8",
          borderRadius: 3,
        }}
      >
        {/* Header Text */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#38793b"
          sx={{ mb: 2 }}
        >
          Welcome, Fellow Foodie!
        </Typography>
        <Typography variant="body1" color="#100f0d" sx={{ mb: 3 }}>
          Already Registered? Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            required
            label="Username"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#100f0d" } }}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#100f0d" } }}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "#38793b",
              color: "white",
              fontSize: "1.1rem",
              py: 1.2,
              borderRadius: 2,
              "&:hover": { bgcolor: "#100f0d" },
            }}
          >
            LOGIN
          </Button>
        </Box>

        {/* Divider for visual separation */}
        <Divider sx={{ my: 4, width: "100%", bgcolor: "#100f0d" }} />

        {/* New User Section */}
        <Typography variant="body1" fontWeight="bold" color="#100f0d">
          New User?
        </Typography>
        <Typography variant="body2" color="#38793b" sx={{ mb: 2 }}>
          Sign Up Now
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/signup")} // Correctly navigate to the SignUp page
          sx={{
            fontSize: "1rem",
            py: 1.2,
            color: "#100f0d",
            borderColor: "#100f0d",
            borderRadius: 2,
            "&:hover": { bgcolor: "#100f0d", color: "white" },
          }}
        >
          SIGN UP
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
