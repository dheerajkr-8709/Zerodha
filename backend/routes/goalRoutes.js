const express = require("express");
const { getGoals, createGoal, updateGoalProgress, deleteGoal } = require("../controllers/GoalController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getGoals);
router.post("/", verifyToken, createGoal);
router.put("/:goalId", verifyToken, updateGoalProgress);
router.delete("/:goalId", verifyToken, deleteGoal);

module.exports = router;
