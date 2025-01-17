import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    // Send POST request to the backend for login
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Parse the response body
    const data = await response.json();
    const token = data.token; // Extract token from response

    // Store the JWT token in localStorage
    localStorage.setItem("jwtToken", token);

    return token;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export { login };
