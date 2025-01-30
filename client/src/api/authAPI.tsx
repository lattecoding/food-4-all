import { UserLogin } from "../interfaces/UserLogin";
import { UserSignup } from "../interfaces/UserSignup";

// Function for logging in
const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem("jwtToken", token);

    return token;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Function for signing up new users
const signup = async (userInfo: UserSignup) => {
  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem("jwtToken", token);

    return token;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

// ✅ Make sure both functions are properly exported
export { login, signup };