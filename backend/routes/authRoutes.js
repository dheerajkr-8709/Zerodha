const express = require("express");
const { signup, login, logout, getCurrentUser, updateRiskProfile } = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);
router.put("/risk-profile", verifyToken, updateRiskProfile);

module.exports = router;
