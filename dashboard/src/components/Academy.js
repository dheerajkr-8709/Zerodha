import React, { useState } from "react";

const Academy = () => {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [answers, setAnswers] = useState({ q1: "", q2: "" });

  const lessons = [
    {
      title: "Understanding P/E Ratio",
      content: "The Price-to-Earnings (P/E) ratio is a key valuation metric calculated by dividing a company's current share price by its earnings per share (EPS). A high P/E ratio may suggest that a stock is overvalued, or that investors expect high growth rates in the future.",
      tips: "Always compare P/E ratios of stocks within the same sector. Comparing a tech company's P/E to a manufacturing utility company's is usually not a fair comparison."
    },
    {
      title: "What is Portfolio Beta?",
      content: "Portfolio Beta measures the volatility of an investment portfolio relative to a benchmark index (usually Nifty 50 or S&P 500). A Beta of 1.0 indicates that the portfolio's price moves in tandem with the market. A Beta > 1.0 implies higher volatility (aggressive), whereas a Beta < 1.0 implies lower volatility (conservative).",
      tips: "To reduce your portfolio beta, you can diversify into defensive sectors like fast-moving consumer goods (FMCG), gold, or government bonds."
    },
    {
      title: "The Sharpe Ratio Demystified",
      content: "The Sharpe Ratio represents the average return earned in excess of the risk-free rate per unit of volatility. It is a mathematical measure of risk-adjusted performance. A Sharpe ratio above 1.0 is considered good, while above 2.0 is considered very good.",
      tips: "A high return is only impressive if it doesn't take extreme risk to achieve. Look for high Sharpe Ratios when picking mutual funds."
    }
  ];

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    if (answers.q1 === "beta") score += 50;
    if (answers.q2 === "pe") score += 50;
    setQuizScore(score);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1 className="title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        🎓 ApexVest Academy
      </h1>
      <p className="subtitle">Learn financial fundamentals, investment risk concepts, and test your knowledge.</p>

      <div className="row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "16px" }}>
        
        {/* Lesson Reader */}
        <div className="col">
          <span><p>📖 Lesson Reader</p></span>
          
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", pb: "10px" }}>
            {lessons.map((lesson, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedLesson(idx)}
                style={{
                  background: selectedLesson === idx ? "var(--primary-blue)" : "none",
                  color: selectedLesson === idx ? "white" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}
              >
                {lesson.title}
              </button>
            ))}
          </div>

          <div>
            <h3 style={{ color: "var(--accent-color)", marginTop: 0 }}>{lessons[selectedLesson].title}</h3>
            <p className="text-muted" style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>
              {lessons[selectedLesson].content}
            </p>
            <div style={{ backgroundColor: "var(--bg-light)", padding: "16px", borderRadius: "8px", borderLeft: "4px solid var(--primary-blue)", marginTop: "16px" }}>
              <strong>Pro Tip:</strong>
              <p className="text-muted" style={{ margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                {lessons[selectedLesson].tips}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Quiz */}
        <div className="col">
          <span><p>📝 Knowledge Check Quiz</p></span>
          
          <form onSubmit={handleQuizSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600" }}>
                1. Which metric measures volatility relative to the market index?
              </p>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                <input 
                  type="radio" 
                  name="q1" 
                  value="pe" 
                  onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                  style={{ marginRight: "8px" }}
                /> P/E Ratio
              </label>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                <input 
                  type="radio" 
                  name="q1" 
                  value="beta" 
                  onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                  style={{ marginRight: "8px" }}
                /> Beta Volatility
              </label>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600" }}>
                2. Which ratio evaluates share price compared to earnings per share?
              </p>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                <input 
                  type="radio" 
                  name="q2" 
                  value="pe" 
                  onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                  style={{ marginRight: "8px" }}
                /> P/E Ratio
              </label>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                <input 
                  type="radio" 
                  name="q2" 
                  value="sharpe" 
                  onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                  style={{ marginRight: "8px" }}
                /> Sharpe Ratio
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Submit Answers
            </button>
          </form>

          {quizScore !== null && (
            <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", backgroundColor: quizScore === 100 ? "var(--success-green-bg)" : "#fef3c7", textAlign: "center" }}>
              <strong>Score: {quizScore}%</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>
                {quizScore === 100 ? "Perfect score! You understand risk mechanics." : "Try again to get a perfect score!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academy;
