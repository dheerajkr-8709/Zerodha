import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: "none" }}>
          <span style={{ fontWeight: "800", fontSize: "1.45rem", color: "#E04F2E", letterSpacing: "-0.5px" }}>
            Zero<span style={{ color: "#387ED1" }}>dha</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/signup" style={{ marginLeft: "25px", fontWeight: "600" }}>
                Signup
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login" style={{ marginLeft: "25px", fontWeight: "600" }}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" style={{ marginLeft: "25px" }}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product" style={{ marginLeft: "25px" }}>
                Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing" style={{ marginLeft: "25px" }}>
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support" style={{ marginLeft: "25px" }}>
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary text-white py-1 px-3 ms-4" to="/developer" style={{ fontSize: "0.9rem", backgroundColor: "#6366F1", border: "none", borderRadius: "6px" }}>
                Dev Hub
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
