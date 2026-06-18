import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5 fw-bold">Open an ApexVest account</h1>
        <p className="text-muted">
          Access automated risk assessment, AI stock suggestions, and zero commission investing.
        </p>
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 mb-5 mt-3"
          style={{ width: "20%", minWidth: "200px", margin: "0 auto", backgroundColor: "#6366F1", border: "none" }}
        >
          Sign up Now
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;
