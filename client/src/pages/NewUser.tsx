import { useState, FormEvent, ChangeEvent } from "react";
// import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Box, Typography } from "@mui/material";

// Mock API function for signing in
const signIn = async (email: string, password: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        alert(`Signing in with email: ${email}`);
        resolve();
      } else {
        reject(new Error("Email and password are required!"));
      }
    }, 300);
  });
};

export default function CredentialsSignInPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("An unknown error occurred");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        marginTop: theme.spacing(8),
        padding: theme.spacing(4),
        boxShadow: 3,
        borderRadius: theme.spacing(2),
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: theme.spacing(2) }}
        >
          Sign In
        </Button>
      </form>
    </Box>
  );
}
