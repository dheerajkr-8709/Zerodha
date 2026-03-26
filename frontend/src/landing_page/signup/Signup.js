import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"}/signup`, {
        email,
        username,
        password,
      });
      if (data.success) {
        alert("Account created successfully! Please login.");
        window.location.href = "/login";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container p-5 mt-5">
      <div className="row">
        <div className="col-lg-7 col-md-12 p-5 text-center">
          <img
            src="media/images/signup.png"
            alt="Signup"
            style={{ width: "90%" }}
          />
        </div>
        <div className="col-lg-5 col-md-12 p-5 mt-4">
          <h1 className="mt-5 fs-2">Signup now</h1>
          <p className="text-muted fs-6 mb-4">
            Create an account to start investing.
          </p>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary fs-5 mb-5"
              style={{ width: "100%", maxWidth: "300px" }}
            >
              Continue
            </button>
          </form>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
