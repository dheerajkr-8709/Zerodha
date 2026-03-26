import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Hero Image"
          className="mb-5 img-fluid"
        />
        <h1 className="mt-5 display-4 fw-bold">Invest in everything</h1>
        <p className="fs-5 text-muted mb-4">
          Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
        </p>
        <Link to="/signup" className="btn btn-primary btn-lg px-5 py-3 fs-5 mb-5 shadow-sm" style={{ width: "fit-content", margin: "0 auto" }}>
          Sign up now
        </Link>
      </div>
    </div>
  );
}

export default Hero;
