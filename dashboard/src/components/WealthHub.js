import React, { useState, useEffect } from "react";
import axios from "axios";

const WealthHub = () => {
  const [selectedStock, setSelectedStock] = useState("RELIANCE");
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(true);

  // Stock Comparison State
  const [compareStockA, setCompareStockA] = useState("INFY");
  const [compareStockB, setCompareStockB] = useState("TCS");
  const [comparisonData, setComparisonData] = useState(null);

  // Goal Tracking State
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://zerodha-backend-117g.onrender.com";
  const token = localStorage.getItem("token") || "";

  // Headers config
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };

  useEffect(() => {
    fetchRiskMetrics();
    fetchStockInsights(selectedStock);
    fetchGoals();
    handleCompare();
  }, []);

  const fetchRiskMetrics = async () => {
    try {
      setLoadingRisk(true);
      const res = await axios.get(`${backendUrl}/api/analytics/risk-metrics`, config);
      setRiskMetrics(res.data);
      setLoadingRisk(false);
    } catch (err) {
      console.error("Error fetching risk metrics:", err);
      // Fallback for demo if not logged in / token expired
      setRiskMetrics({
        riskProfile: "Moderate",
        portfolioBeta: 1.05,
        description: "Your portfolio is balanced and aligns closely with market movements.",
        assetAllocation: { equities: 60, debt: 30, gold: 10 },
        volatilityScore: 53,
        metrics: { cagr: "13.4%", sharpeRatio: 1.22, standardDeviation: "14.5%" }
      });
      setLoadingRisk(false);
    }
  };

  const fetchStockInsights = async (symbol) => {
    try {
      setLoadingInsights(true);
      const res = await axios.get(`${backendUrl}/api/analytics/insights?symbol=${symbol}`, config);
      setInsights(res.data);
      setLoadingInsights(false);
    } catch (err) {
      console.error("Error fetching stock insights:", err);
      setLoadingInsights(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/goals`, config);
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
      // Demo goals fallback
      setGoals([
        { _id: "1", title: "Retirement Corpus", targetAmount: 5000000, currentAmount: 1200000, targetDate: "2035-12-31" },
        { _id: "2", title: "Tesla Downpayment", targetAmount: 800000, currentAmount: 200000, targetDate: "2028-06-30" }
      ]);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget || !newGoalDate) return;
    try {
      await axios.post(`${backendUrl}/api/goals`, {
        title: newGoalTitle,
        targetAmount: Number(newGoalTarget),
        targetDate: newGoalDate
      }, config);
      setNewGoalTitle("");
      setNewGoalTarget("");
      setNewGoalDate("");
      fetchGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
      // Mock update for visual feedback in case of network issues
      const mockGoal = {
        _id: Math.random().toString(),
        title: newGoalTitle,
        targetAmount: Number(newGoalTarget),
        currentAmount: 0,
        targetDate: newGoalDate
      };
      setGoals([...goals, mockGoal]);
      setNewGoalTitle("");
      setNewGoalTarget("");
      setNewGoalDate("");
    }
  };

  const handleUpdateProgress = async (id, amount) => {
    const newAmt = prompt("Enter new current amount (₹):", amount);
    if (newAmt === null || isNaN(Number(newAmt))) return;
    try {
      await axios.put(`${backendUrl}/api/goals/${id}`, { currentAmount: Number(newAmt) }, config);
      fetchGoals();
    } catch (err) {
      console.error("Error updating goal progress:", err);
      setGoals(goals.map(g => g._id === id ? { ...g, currentAmount: Number(newAmt) } : g));
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await axios.delete(`${backendUrl}/api/goals/${id}`, config);
      fetchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
      setGoals(goals.filter(g => g._id !== id));
    }
  };

  const handleCompare = () => {
    const mockDatabase = {
      INFY: { name: "Infosys Ltd", sector: "IT Services", pe: 24.5, beta: 0.95, dividend: "2.8%", cap: "Large Cap" },
      TCS: { name: "Tata Consultancy Services", sector: "IT Services", pe: 28.2, beta: 0.82, dividend: "3.1%", cap: "Large Cap" },
      RELIANCE: { name: "Reliance Industries Ltd", sector: "Energy & Telecom", pe: 26.8, beta: 1.15, dividend: "0.8%", cap: "Large Cap" },
      SBIN: { name: "State Bank of India", sector: "Public Banking", pe: 9.4, beta: 1.25, dividend: "1.5%", cap: "Large Cap" },
      HDFCBANK: { name: "HDFC Bank Ltd", sector: "Private Banking", pe: 18.9, beta: 1.02, dividend: "1.2%", cap: "Large Cap" },
      WIPRO: { name: "Wipro Ltd", sector: "IT Services", pe: 20.1, beta: 1.05, dividend: "2.2%", cap: "Large Cap" }
    };

    const dataA = mockDatabase[compareStockA.toUpperCase()] || { name: compareStockA, sector: "Unknown", pe: "N/A", beta: 1.0, dividend: "N/A", cap: "N/A" };
    const dataB = mockDatabase[compareStockB.toUpperCase()] || { name: compareStockB, sector: "Unknown", pe: "N/A", beta: 1.0, dividend: "N/A", cap: "N/A" };

    setComparisonData({ stockA: dataA, stockB: dataB });
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1 className="title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        🧠 ApexVest Wealth Hub
      </h1>
      <p className="subtitle">AI insights, portfolio optimization engines, and future goal trackers.</p>

      {/* Grid containing Analytics and Risk */}
      <div className="row" style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Risk Assessment Gauge */}
        <div className="col">
          <span><p>🛡️ Portfolio Risk Profile</p></span>
          {loadingRisk ? (
            <p>Analyzing portfolio risk...</p>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 className="imp" style={{ margin: 0, color: "var(--accent-color)" }}>{riskMetrics?.riskProfile}</h3>
                  <small className="text-muted">Assigned Strategy Profile</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h4 style={{ margin: 0 }}>Beta: {riskMetrics?.portfolioBeta}</h4>
                  <small className="text-muted">Market Sensitivity Index</small>
                </div>
              </div>

              <div style={{ height: "8px", background: "var(--border-light)", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ 
                  height: "100%", 
                  width: `${riskMetrics?.volatilityScore}%`, 
                  background: `linear-gradient(90deg, var(--success-green) 0%, var(--secondary-orange) 50%, var(--danger-red) 100%)` 
                }}></div>
              </div>
              <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                {riskMetrics?.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px", background: "var(--bg-light)", padding: "12px", borderRadius: "8px" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Target CAGR</p>
                  <strong style={{ fontSize: "0.9rem" }}>{riskMetrics?.metrics.cagr}</strong>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Sharpe Ratio</p>
                  <strong style={{ fontSize: "0.9rem" }}>{riskMetrics?.metrics.sharpeRatio}</strong>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Volatility (SD)</p>
                  <strong style={{ fontSize: "0.9rem" }}>{riskMetrics?.metrics.standardDeviation}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market Sentiment Gauge */}
        <div className="col">
          <span><p>📈 Market Sentiment Indicator</p></span>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <h2 style={{ fontSize: "2rem", margin: "0 0 4px 0", color: "var(--success-green)" }}>68% Bullish</h2>
            <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
              Technical indicator indices report Greed prevailing, supported by robust institutional buying.
            </p>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
              <span className="badge" style={{ backgroundColor: "var(--success-green-bg)", color: "var(--success-green)", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem" }}>
                FII: Buy (+₹1,240 Cr)
              </span>
              <span className="badge" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger-red)", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem" }}>
                DII: Sell (-₹210 Cr)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row for AI Insights and Stock Comparison */}
      <div className="row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* AI Stock Insights */}
        <div className="col">
          <span><p>🤖 AI Stock Copilot Insights</p></span>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <select 
              value={selectedStock} 
              onChange={(e) => {
                setSelectedStock(e.target.value);
                fetchStockInsights(e.target.value);
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                background: "var(--bg-white)",
                color: "var(--text-main)"
              }}
            >
              <option value="RELIANCE">Reliance Industries (RELIANCE)</option>
              <option value="INFY">Infosys Ltd (INFY)</option>
              <option value="TCS">Tata Consultancy Services (TCS)</option>
              <option value="SBIN">State Bank of India (SBIN)</option>
              <option value="HDFCBANK">HDFC Bank (HDFCBANK)</option>
            </select>
            <button 
              className="btn btn-primary"
              onClick={() => fetchStockInsights(selectedStock)}
              style={{ padding: "8px 16px" }}
            >
              Analyze
            </button>
          </div>

          {loadingInsights ? (
            <p>Running neural analysis...</p>
          ) : insights ? (
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span className="badge" style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: insights.sentiment === "Bullish" ? "var(--success-green-bg)" : "var(--border-light)",
                  color: insights.sentiment === "Bullish" ? "var(--success-green)" : "var(--text-main)"
                }}>{insights.sentiment} Outlook</span>
                <strong>AI Score: {insights.score}/100</strong>
              </div>
              <p className="text-muted" style={{ lineHeight: "1.4", marginBottom: "12px" }}>{insights.summary}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <strong style={{ color: "var(--success-green)" }}>Pros:</strong>
                  <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                    {insights.pros?.map((p, i) => <li key={i} className="text-muted">{p}</li>)}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: "var(--danger-red)" }}>Cons:</strong>
                  <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                    {insights.cons?.map((c, i) => <li key={i} className="text-muted">{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p>Select a stock to run technical models.</p>
          )}
        </div>

        {/* Stock Comparison Tool */}
        <div className="col">
          <span><p>🔄 Stock Side-by-Side Comparison</p></span>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <select 
              value={compareStockA} 
              onChange={(e) => setCompareStockA(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-white)", color: "var(--text-main)" }}
            >
              <option value="INFY">INFY</option>
              <option value="TCS">TCS</option>
              <option value="RELIANCE">RELIANCE</option>
              <option value="SBIN">SBIN</option>
              <option value="HDFCBANK">HDFCBANK</option>
            </select>
            <strong style={{ alignSelf: "center" }}>VS</strong>
            <select 
              value={compareStockB} 
              onChange={(e) => setCompareStockB(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-white)", color: "var(--text-main)" }}
            >
              <option value="TCS">TCS</option>
              <option value="INFY">INFY</option>
              <option value="RELIANCE">RELIANCE</option>
              <option value="SBIN">SBIN</option>
              <option value="HDFCBANK">HDFCBANK</option>
            </select>
            <button className="btn btn-primary" onClick={handleCompare} style={{ padding: "8px 16px" }}>Compare</button>
          </div>

          {comparisonData && (
            <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <th style={{ textAlign: "left", padding: "8px 0" }}>Metric</th>
                  <th style={{ textAlign: "right", color: "var(--accent-color)" }}>{compareStockA}</th>
                  <th style={{ textAlign: "right", color: "var(--success-green)" }}>{compareStockB}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 0" }}>Name</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockA.name}</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockB.name}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 0" }}>Sector</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockA.sector}</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockB.sector}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 0" }}>P/E Ratio</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockA.pe}</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockB.pe}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 0" }}>Beta Volatility</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockA.beta}</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockB.beta}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 0" }}>Div. Yield</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockA.dividend}</td>
                  <td style={{ textAlign: "right" }}>{comparisonData.stockB.dividend}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Goal Tracker Section */}
      <div className="col" style={{ marginTop: "24px", width: "100%" }}>
        <span><p>🎯 Investment Goal Tracker</p></span>
        <form onSubmit={handleCreateGoal} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Goal Title (e.g. Dream House)" 
            value={newGoalTitle} 
            onChange={(e) => setNewGoalTitle(e.target.value)}
            style={{ flex: 2, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-white)", color: "var(--text-main)" }}
          />
          <input 
            type="number" 
            placeholder="Target Amount (₹)" 
            value={newGoalTarget} 
            onChange={(e) => setNewGoalTarget(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-white)", color: "var(--text-main)" }}
          />
          <input 
            type="date" 
            value={newGoalDate} 
            onChange={(e) => setNewGoalDate(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-white)", color: "var(--text-main)" }}
          />
          <button className="btn btn-primary" type="submit" style={{ padding: "8px 20px" }}>Add Goal</button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {goals.map((g) => {
            const progressPercent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <div key={g._id} style={{ border: "1px solid var(--border-light)", padding: "16px", borderRadius: "10px", background: "var(--bg-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "1rem" }}>{g.title}</strong>
                  <div>
                    <button onClick={() => handleUpdateProgress(g._id, g.currentAmount)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--accent-color)" }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteGoal(g._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--danger-red)", marginLeft: "8px" }}>🗑️</button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <span>Progress: {progressPercent}%</span>
                  <span>Target: ₹{g.targetAmount.toLocaleString()}</span>
                </div>
                <div style={{ height: "8px", background: "var(--border-light)", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${progressPercent}%`, backgroundColor: "var(--success-green)" }}></div>
                </div>
                <div style={{ fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Saved: <strong>₹{g.currentAmount.toLocaleString()}</strong></span>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>Date: {new Date(g.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="col" style={{ marginTop: "24px" }}>
        <span><p>💡 AI-Driven Asset Allocation Strategy</p></span>
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Based on your active **{riskMetrics?.riskProfile}** profile, we recommend re-allocating a small portion from high beta IT stocks (e.g. INFY) into treasury bonds to optimize your Sharpe Ratio.
        </p>
      </div>
    </div>
  );
};

export default WealthHub;
