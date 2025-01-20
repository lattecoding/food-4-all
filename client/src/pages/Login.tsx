import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      setError("Username and password are required");
      return;
    }
    try {
      const data = await login(loginData);
      Auth.login(data);
    } catch (err) {
      setError("Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <main className="ktool">
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p className="error">{error}</p>}
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={loginData.username || ""}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password || ""}
            onChange={handleChange}
          />
          <button type="submit">Submit Form</button>
        </form>
      </div>
    </main>
  );
};

export default Login;
