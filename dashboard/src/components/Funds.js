import React, { useState, useEffect } from "react";
import axios from "axios";

const Funds = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
        const res = await axios.get(`${backendUrl}/allOrders`);
        setOrdersData(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders for funds:", error);
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddFunds = () => {
    alert("Payment Gateway Integration coming soon!");
  };

  const handleWithdraw = () => {
    alert("Withdrawal request submitted!");
  };

  const handleOpenAccount = () => {
    alert("Redirecting to Commodity Account opening portal.");
  };

  // Dynamic calculations (matching Summary logic)
  const OPENING_BALANCE = 100000;
  const totalUsedMargin = ordersData.reduce((acc, order) => acc + (order.price * order.qty), 0);
  const availableMargin = OPENING_BALANCE - totalUsedMargin;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  if (isLoading) {
    return <div className="p-5 text-center">Loading funds data...</div>;
  }

  return (
    <>
      <div className="funds-header">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <div className="action-buttons">
          <button className="btn btn-green" onClick={handleAddFunds}>Add funds</button>
          <button className="btn btn-blue" onClick={handleWithdraw}>Withdraw</button>
        </div>
      </div>

      <div className="row funds-container">
        <div className="col equity-section">
          <div className="section-title">
            <p>Equity</p>
          </div>

          <div className="funds-table">
            <div className="data-row">
              <p>Available margin</p>
              <p className="val highlight">{formatCurrency(availableMargin)}</p>
            </div>
            <div className="data-row">
              <p>Used margin</p>
              <p className="val">{formatCurrency(totalUsedMargin)}</p>
            </div>
            <div className="data-row">
              <p>Available cash</p>
              <p className="val highlight">{formatCurrency(availableMargin)}</p>
            </div>
            <hr className="table-divider" />
            <div className="data-row">
              <p>Opening Balance</p>
              <p className="val">{formatCurrency(OPENING_BALANCE)}</p>
            </div>
            <div className="data-row">
              <p>Payin</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
            <div className="data-row">
              <p>SPAN</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
            <div className="data-row">
              <p>Delivery margin</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
            <div className="data-row">
              <p>Exposure</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
            <div className="data-row">
              <p>Options premium</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
            <hr className="table-divider" />
            <div className="data-row">
              <p>Total Collateral</p>
              <p className="val">{formatCurrency(0)}</p>
            </div>
          </div>
        </div>

        <div className="col commodity-section">
          <div className="commodity-card">
            <p className="msg">You don't have a commodity account</p>
            <button className="btn btn-blue-outline" onClick={handleOpenAccount}>Open Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
