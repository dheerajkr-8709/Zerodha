import React from "react";

function CreateTicket() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2">To create a ticket, select a relevant topic</h1>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-plus-circle" aria-hidden="true"></i> Account Opening</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Online Account Opening</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Offline Account Opening</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Company, Partnership and HUF</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>NRI Account Opening</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Charges at Zerodha</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Getting Started</a><br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-user-o" aria-hidden="true"></i> Your Zerodha Account</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Login and Password</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Kite and Features</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Profile and Settings</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Nominee and Nomination</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Closing Account</a><br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-bar-chart" aria-hidden="true"></i> Trading and Markets</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Trading FAQs</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Kite and Features</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Margins and Leverage</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Product and Order types</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Corporate Actions</a><br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-credit-card" aria-hidden="true"></i> Funds</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Adding Funds</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Withdrawals</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Adding Bank Accounts</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>eMandates</a><br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-circle-o-notch" aria-hidden="true"></i> Console</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Reports and Tax P&L</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Ledger and Statements</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Portfolio and Holdings</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>IPOs and Bonds</a><br />
        </div>
        <div className="col-4 p-5 mt-2 mb-2">
          <h4><i className="fa fa-university" aria-hidden="true"></i> Coin</h4>
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Mutual Funds FAQs</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Buying and Selling</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>SIP and STP</a><br />
          <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>Transferring Mutual Funds</a><br />
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
