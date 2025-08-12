import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/auth/login`, formData);
      const token = res.data.token;

      // Decode JWT to get expiry
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = exp * 1000;
      const now = Date.now();

      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.userId);

      // Auto logout when token expires
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }, expiryTime - now);

      navigate("/stocks");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="container forms">
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <input type="email" placeholder="Email" name="email" className="input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="field input-field">
              <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" className="password" value={formData.password} onChange={handleChange} required />
              <i className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye-icon`} onClick={() => setShowPassword(!showPassword)}></i>
            </div>
            <div className="field button-field">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="form-link">
            <span>Don't have an account? <Link to="/signup">Signup</Link></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
