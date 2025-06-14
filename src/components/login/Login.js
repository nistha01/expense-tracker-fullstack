import React, { useState } from "react";

const AuthApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
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
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
      <p
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage("");
        }}
        style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
      >
        {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default AuthApp;
