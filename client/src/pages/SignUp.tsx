import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { signup } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Divider, Paper } from "@mui/material";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for button

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!signUpData.username || !signUpData.email || !signUpData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const token = await signup(signUpData);
      if (token) {
        Auth.login(token);
        navigate("/"); // Redirect to homepage after successful sign-up
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
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
          Create an Account
        </Typography>
        <Typography variant="body1" color="#100f0d" sx={{ mb: 3 }}>
          Join us and start discovering food spots!
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Sign-Up Form */}
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
            value={signUpData.username}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#100f0d" } }}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            fullWidth
            required
            type="email"
            label="Email"
            name="email"
            value={signUpData.email}
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
            value={signUpData.password}
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
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Box>

        {/* Divider for visual separation */}
        <Divider sx={{ my: 4, width: "100%", bgcolor: "#100f0d" }} />

        {/* Already Registered Section */}
        <Typography variant="body1" fontWeight="bold" color="#100f0d">
          Already have an account?
        </Typography>
        <Typography variant="body2" color="#38793b" sx={{ mb: 2 }}>
          Log in now
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{
            fontSize: "1rem",
            py: 1.2,
            color: "#100f0d",
            borderColor: "#100f0d",
            borderRadius: 2,
            "&:hover": { bgcolor: "#100f0d", color: "white" },
          }}
        >
          LOGIN
        </Button>
      </Paper>
    </Box>
  );
};

export default SignUp;
