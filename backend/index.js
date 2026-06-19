const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const goalRoutes = require("./routes/goalRoutes");
const insightRoutes = require("./routes/insightRoutes");

const { signup, login } = require("./controllers/AuthController");
const { getHoldings, getPositions, getOrders, executeOrder } = require("./controllers/OrderController");
const { verifyToken } = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Reusable/New modular route APIs
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/analytics", insightRoutes);

// Backwards-compatible routes to avoid breaking existing requests
app.post("/signup", signup);
app.post("/login", login);
app.get("/allHoldings", verifyToken, getHoldings);
app.get("/allPositions", verifyToken, getPositions);
app.get("/allOrders", verifyToken, getOrders);
app.post("/newOrder", verifyToken, executeOrder);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
  mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("Database connection failure:", err));
});
