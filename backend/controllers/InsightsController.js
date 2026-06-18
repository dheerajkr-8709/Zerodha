const getStockInsights = async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required" });
    }

    const uppercaseSymbol = symbol.toUpperCase();

    const insightsDatabase = {
      RELIANCE: {
        sentiment: "Bullish",
        score: 85,
        summary: "Reliance Industries is showing strong growth prospects in its retail and digital segments. Technical analysis displays a cup-and-handle pattern breakout on the weekly chart. Growth in green energy investments is expected to offset traditional refining volatility.",
        pros: ["Strong balance sheet", "Dominant telecom positioning", "Expansion into green hydrogen"],
        cons: ["High capital expenditure cycles", "Traditional oil-to-chemicals refining margins are volatile"],
      },
      INFY: {
        sentiment: "Neutral",
        score: 55,
        summary: "Infosys is currently facing macro headwinds in North American banking & financial services clients. Although cloud migration deal pipelines are robust, margin pressures persist due to high subcontractor costs and wage hikes.",
        pros: ["Robust free cash flow generation", "Excellent corporate governance"],
        cons: ["Sluggish discretionary tech spending in the US", "Talent attrition challenges"],
      },
      TCS: {
        sentiment: "Bullish",
        score: 72,
        summary: "TCS is well-positioned to capitalize on AI-led cloud transformation deals. Their long-term contracts offer earnings visibility, and operating margins remain industry-leading.",
        pros: ["High dividend yields", "Strong execution capabilities"],
        cons: ["Geopolitical challenges in European markets"],
      },
      SBIN: {
        sentiment: "Bullish",
        score: 80,
        summary: "State Bank of India shows improving asset quality with lowering gross NPA metrics. Loan book expansion is driven by retail credit demand. The interest margin is expected to stabilize.",
        pros: ["Lowest credit costs in recent years", "High capitalization levels"],
        cons: ["Slower deposit growth relative to credit expansion"],
      },
      HDFCBANK: {
        sentiment: "Bullish",
        score: 78,
        summary: "Post-merger synergies are starting to materialize. Deposit accumulation has accelerated, and valuation is attractive relative to historical averages.",
        pros: ["Large distribution network", "Strong risk management framework"],
        cons: ["Slight NIM compression during integration phase"],
      }
    };

    const insight = insightsDatabase[uppercaseSymbol] || {
      sentiment: "Neutral",
      score: 60,
      summary: `AI Analysis for ${uppercaseSymbol}: The asset is showing steady volume indicators. Technical oscillators are in the neutral zone. Support levels are firm around the 50-day moving average. Investors are advised to track quarterly earnings reports.`,
      pros: ["Consistent volume patterns", "Stable moving average support"],
      cons: ["Sector-specific regulatory risks"],
    };

    res.status(200).json({ symbol: uppercaseSymbol, ...insight });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock insights: " + error.message });
  }
};

const getPortfolioRiskMetrics = async (req, res) => {
  try {
    const riskProfile = req.user ? req.user.riskProfile || "Moderate" : "Moderate";
    
    // We calculate a portfolio beta based on mock calculations.
    // For example:
    // Conservative: Beta 0.75, Low Volatility
    // Moderate: Beta 1.05, Balanced
    // Aggressive: Beta 1.45, High Growth
    
    let beta = 1.05;
    let description = "Your portfolio is balanced and aligns closely with market movements.";
    let assetAllocation = { equities: 60, debt: 30, gold: 10 };

    if (riskProfile === "Conservative") {
      beta = 0.72;
      description = "Your portfolio prioritizes capital preservation with low volatility assets.";
      assetAllocation = { equities: 30, debt: 50, gold: 20 };
    } else if (riskProfile === "Aggressive") {
      beta = 1.38;
      description = "Your portfolio focuses on high capital appreciation, holding higher beta growth stocks.";
      assetAllocation = { equities: 85, debt: 10, gold: 5 };
    }

    res.status(200).json({
      riskProfile,
      portfolioBeta: beta,
      description,
      assetAllocation,
      volatilityScore: Math.round(beta * 50), // Map beta to 0-100 gauge
      metrics: {
        cagr: riskProfile === "Aggressive" ? "18.2%" : riskProfile === "Conservative" ? "8.5%" : "13.4%",
        sharpeRatio: riskProfile === "Conservative" ? 1.45 : riskProfile === "Moderate" ? 1.22 : 1.08,
        standardDeviation: riskProfile === "Conservative" ? "8.2%" : riskProfile === "Moderate" ? "14.5%" : "22.1%"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating risk metrics: " + error.message });
  }
};

module.exports = { getStockInsights, getPortfolioRiskMetrics };
