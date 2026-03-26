import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"}/login`, {
        email,
        password,
      }, { withCredentials: true });
      
      console.log("LOGIN RESPONSE RECEIVED:", data);

      if (data && data.success) {
        setIsSuccess(true);
        setIsLoading(false);
        
        // Extract username safely
        const userDisplayName = (data.user && data.user.username) ? data.user.username : email.split('@')[0];
        setUsername(userDisplayName);

        // Intelligent Port Sensing: 
        // If frontend is on 3000, dashboard is 3001. If frontend is on 3001, dashboard is 3000.
        const currentPort = window.location.port;
        const targetPort = currentPort === "3000" ? "3001" : "3000";
        const dashboardUrl = `http://localhost:${targetPort}/?username=${encodeURIComponent(userDisplayName)}`;
        
        // Show success alert BEFORE redirect to confirm data is correct
        alert(`Login Successful! Detected Dashboard at port ${targetPort}. Redirecting now...`);
        
        console.log("KICKING OFF SMART REDIRECT FROM PORT", currentPort, "TO", targetPort);
        window.location.href = dashboardUrl;
      } else {
        setIsLoading(false);
        const failMsg = data?.message || "Login failed - check your credentials";
        alert("Login Failed: " + failMsg);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("AXIOS LOGIN ERROR:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown communication error";
      alert("Network/Server Error: " + errorMsg);
    }
  };

  return (
    <div className="container p-5 mt-5">
      <div className="row">
        <div className="col-lg-7 col-md-12 p-5 text-center">
          <img
            src="media/images/signup.png"
            alt="Login"
            style={{ width: "90%" }}
          />
        </div>
        <div className="col-lg-5 col-md-12 p-5 mt-4">
          <h1 className="mt-5 fs-2">{isSuccess ? "Welcome back!" : "Login"}</h1>
          {isSuccess ? (
            <div className="alert alert-success">
              <p className="mb-0">Logged in successfully! Redirecting to your dashboard...</p>
              <a href={`http://localhost:3001/?username=${encodeURIComponent(username)}`} className="btn btn-link p-0">Click here if not redirected</a>
            </div>
          ) : (
            <p className="text-muted fs-6 mb-4">Login to your Zerodha account to continue.</p>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                required
                disabled={isSuccess}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                disabled={isSuccess}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`btn ${isSuccess ? 'btn-success' : 'btn-primary'} fs-5 mb-5`}
              style={{ width: "100%", maxWidth: "300px" }}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? "Logging in..." : isSuccess ? "Redirecting..." : "Login"}
            </button>
          </form>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Don't have an account? <a href="/signup">Signup here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
