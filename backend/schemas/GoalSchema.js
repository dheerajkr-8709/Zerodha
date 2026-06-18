const { Schema } = require("mongoose");

const GoalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  linkedHoldings: [
    {
      stockName: String,
      allocatedQty: Number,
    }
  ],
  createdAt: {
    type: Date,
    default: () => new Date(),
  }
});

module.exports = { GoalSchema };
