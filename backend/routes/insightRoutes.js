const express = require("express");
const { getStockInsights, getPortfolioRiskMetrics } = require("../controllers/InsightsController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/insights", verifyToken, getStockInsights);
router.get("/risk-metrics", verifyToken, getPortfolioRiskMetrics);

module.exports = router;
