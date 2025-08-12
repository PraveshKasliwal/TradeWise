import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/auth/register`, { email: formData.email, password: formData.password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="container forms show-signup">
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <input type="email" placeholder="Email" name="email" className="input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="field input-field">
              <input type={showPassword.password ? "text" : "password"} placeholder="Password" name="password" className="password" value={formData.password} onChange={handleChange} required />
              <i className={`bx ${showPassword.password ? "bx-show" : "bx-hide"} eye-icon`} onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}></i>
            </div>
            <div className="field input-field">
              <input type={showPassword.confirm ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" className="password" value={formData.confirmPassword} onChange={handleChange} required />
              <i className={`bx ${showPassword.confirm ? "bx-show" : "bx-hide"} eye-icon`} onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}></i>
            </div>
            <div className="field button-field">
              <button type="submit">Signup</button>
            </div>
          </form>
          <div className="form-link">
            <span>Already have an account? <Link to="/login">Login</Link></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
