import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

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
      const data = await login({
        username: loginData.username,
        password: loginData.password,
      });

      Auth.login(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        bgcolor: "#d2e8e4", // Soft green background
        pt: 10, // Push content higher
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 400,
          textAlign: "center",
          bgcolor: "white",
          borderRadius: 2,
        }}
      >
        {/* Header Text */}
        <Typography variant="h4" fontWeight="bold" color="#100f0d" sx={{ mb: 2 }}>
          Welcome, Fellow Foodie!
        </Typography>
        <Typography variant="body2" color="#38793b" sx={{ mb: 4 }}>
          Already Registered? Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            required
            label="Username"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#100f0d" } }}
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
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "#100f0d",
              color: "white",
              "&:hover": { bgcolor: "#38793b" },
            }}
            onClick={handleSubmit}
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
          onClick={() => navigate("/signup")}
          sx={{
            color: "#100f0d",
            borderColor: "#100f0d",
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
