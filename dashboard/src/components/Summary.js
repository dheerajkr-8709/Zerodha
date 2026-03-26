import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const username = localStorage.getItem("username") || "User";
  const [holdingsData, setHoldingsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
        const [holdingsRes, ordersRes] = await Promise.all([
          axios.get(`${backendUrl}/allHoldings`),
          axios.get(`${backendUrl}/allOrders`)
        ]);
        setHoldingsData(holdingsRes.data);
        setOrdersData(ordersRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddFunds = () => {
    alert("Redirecting to safe payment portal. Feature integration in progress!");
  };

  // Dynamic calculations
  const OPENING_BALANCE = 100000; // Starting with ₹1 Lakh demo balance
  
  const totalInvestment = holdingsData.reduce((acc, stock) => acc + (stock.avg * stock.qty), 0);
  const totalCurrentValue = holdingsData.reduce((acc, stock) => acc + (stock.price * stock.qty), 0);
  const totalPL = totalCurrentValue - totalInvestment;
  const plPercentage = totalInvestment > 0 ? ((totalPL / totalInvestment) * 100).toFixed(2) : 0;

  const totalUsedMargin = ordersData.reduce((acc, order) => {
    // Basic calculation for used margin based on orders
    return acc + (order.price * order.qty);
  }, 0);

  const availableMargin = OPENING_BALANCE - totalUsedMargin;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  if (isLoading) {
    return <div className="p-5 text-center">Loading your portfolio...</div>;
  }

  return (
    <div className="summary-container">
      <div className="username">
        <h1 className="title">Welcome, {username}</h1>
        <p className="subtitle">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="analytics-cards">
        <div className="card">
          <div className="card-header">
             <p className="card-title">Equity Margin</p>
          </div>
          <div className="card-body">
            <h3 className="imp">{formatCurrency(availableMargin)}</h3>
            <p className="text-muted">Available Margin</p>
            <div className="divider"></div>
            <div className="card-footer-info">
              <p>Used Margin <span>{formatCurrency(totalUsedMargin)}</span></p>
              <p>Opening Balance <span>{formatCurrency(OPENING_BALANCE)}</span></p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
             <p className="card-title">Holdings ({holdingsData.length})</p>
          </div>
          <div className="card-body">
            <h3 className={`imp ${totalPL >= 0 ? "profit" : "loss"}`}>
              {totalPL >= 0 ? "+" : ""}{formatCurrency(totalPL)} 
              <small>({totalPL >= 0 ? "+" : ""}{plPercentage}%)</small>
            </h3>
            <p className="text-muted">Total P&L</p>
            <div className="divider"></div>
            <div className="card-footer-info">
              <p>Current Value <span>{formatCurrency(totalCurrentValue)}</span></p>
              <p>Investment <span>{formatCurrency(totalInvestment)}</span></p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
             <p className="card-title">Account Activity</p>
          </div>
          <div className="card-body">
            <div className="activity-placeholder">
              <p className="text-muted">No recent withdrawals or deposits.</p>
              <button className="btn btn-primary" onClick={handleAddFunds} style={{ marginTop: '16px', width: '100%', cursor: 'pointer' }}>Add Funds</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
