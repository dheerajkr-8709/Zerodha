const express = require("express");
const { getHoldings, getPositions, getOrders, executeOrder } = require("../controllers/OrderController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/allHoldings", verifyToken, getHoldings);
router.get("/allPositions", verifyToken, getPositions);
router.get("/allOrders", verifyToken, getOrders);
router.post("/newOrder", verifyToken, executeOrder);

module.exports = router;
