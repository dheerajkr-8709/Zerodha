const { model } = require("mongoose");
const { GoalSchema } = require("../schemas/GoalSchema");

const GoalModel = new model("goal", GoalSchema);

module.exports = { GoalModel };
