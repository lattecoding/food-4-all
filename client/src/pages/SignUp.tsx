import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { signup } from "../api/authAPI"; // Uses the existing signup function in authAPI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
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
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Create an Account
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          fullWidth
          required
          label="Username"
          name="username"
          value={signUpData.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          type="email"
          label="Email"
          name="email"
          value={signUpData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          type="password"
          label="Password"
          name="password"
          value={signUpData.password}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Box>
    </Box>
  );
};

export default SignUp;