import React, { useState } from "react";
import { useAuth } from "./authContext";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:3001/login/findUserForLogin"
      : "http://localhost:3001/user/postUser";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Success");
        if (isLogin && data.user) {
          login(data.user); 
        }
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "OTP sent to your email.");
      } else {
        setMessage(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>
        {isForgotPassword ? "Forgot Password" : isLogin ? "Login" : "Signup"}
      </h2>

      {/* Forgot Password Form */}
      {isForgotPassword ? (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ margin: "5px" }}
          />
          <br />
          <button type="submit">Send OTP</button>
          <p
            onClick={() => {
              setIsForgotPassword(false);
              setMessage("");
            }}
            style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          >
            Back to {isLogin ? "Login" : "Signup"}
          </p>
        </form>
      ) : (
        // Login or Signup Form
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ margin: "5px" }}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ margin: "5px" }}
          />
          <br />
          <button type="submit">{isLogin ? "Login" : "Signup"}</button>
        </form>
      )}

      {/* Display Message */}
      {message && (
        <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
      )}

      {/* Toggle Login/Signup */}
      {!isForgotPassword && (
        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      )}

      {/* Forgot Password link (Always visible when not on forgot screen) */}
      {!isForgotPassword && (
        <p
          onClick={() => {
            setIsForgotPassword(true);
            setMessage("");
          }}
          style={{ cursor: "pointer", color: "red", marginTop: "10px" }}
        >
          Forgot Password?
        </p>
      )}
    </div>
  );
};

export default Authentication;
