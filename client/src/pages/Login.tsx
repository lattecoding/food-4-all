import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";
//import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

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
    try {
      // Send login request
      const data = await login(loginData);

      // On successful login, store the token and redirect
      Auth.login(data); // Ensure this passes the token properly
    } catch (err) {
      console.error("Failed to login", err);
    }
  };

  return (
    <main className="ktool">
      
    <div className="container">
      
          
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
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
