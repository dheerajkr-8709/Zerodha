const { Schema } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  riskProfile: {
    type: String,
    enum: ["Conservative", "Moderate", "Aggressive"],
    default: "Moderate",
  },
  balance: {
    type: Number,
    default: 100000.00,
  },
  mobile: {
    type: String,
  },
  pan: {
    type: String,
  },
  dob: {
    type: String,
  },
  bankAccount: {
    type: String,
  },
  ifsc: {
    type: String,
  },
  aadhaar: {
    type: String,
  },
  ipvVerified: {
    type: Boolean,
    default: false,
  },
  eSignCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = { UserSchema };
