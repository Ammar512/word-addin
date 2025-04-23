import React, { useState } from "react";

type LoginProps = {
  onLogin: (token: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [country, setCountry] = useState("AU");
  const [email, setEmail] = useState("companyAdmin1");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!country || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const result = await response.json();

      if (result.token) {
        setError("");
        onLogin(result.token);
      } else {
        setError("Invalid login. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please check the server or credentials.");
    }
  };

  return (
    <div className="login-card shadow-sm p-4 bg-white rounded">
      <img
        src="https://app.liradocs.com/logo/liradocs-icon.png"
        alt="Logo"
        className="mb-3 mx-auto d-block"
        style={{ width: "100px" }}
      />
      <h4 className="mb-3 text-primary text-center">Login</h4>

      <div className="mb-3">
        <label htmlFor="countrySelect" className="form-label">
          Country
        </label>
        <select
          id="countrySelect"
          className="form-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          <option value="AU">Australia</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="passwordInput" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
