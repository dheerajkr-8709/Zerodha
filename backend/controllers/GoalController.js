const { GoalModel } = require("../model/GoalModel");

const getGoals = async (req, res) => {
  try {
    const goals = await GoalModel.find({ userId: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching investment goals: " + error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, targetDate, linkedHoldings } = req.body;
    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({ message: "Please provide title, target amount, and target date." });
    }

    const newGoal = new GoalModel({
      userId: req.user.id,
      title,
      targetAmount,
      targetDate,
      linkedHoldings: linkedHoldings || [],
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal created successfully", success: true, goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: "Error creating goal: " + error.message });
  }
};

const updateGoalProgress = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { currentAmount } = req.body;

    const goal = await GoalModel.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      { currentAmount },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal progress updated", success: true, goal });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal progress: " + error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const goal = await GoalModel.findOneAndDelete({ _id: goalId, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal: " + error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoalProgress, deleteGoal };
