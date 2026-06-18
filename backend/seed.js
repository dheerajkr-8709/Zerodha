const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");

const uri = process.env.MONGO_URL;

const tempHoldings = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%" },
  { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%" }
];

const tempPositions = [
  { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
  { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true }
];

const seedDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    // Seed a default demo user
    const { UserModel } = require("./model/UserModel");
    const bcrypt = require("bcryptjs");
    
    // Clear the demo user if they exist
    await UserModel.deleteMany({ email: "test@example.com" });
    
    const hashedPassword = await bcrypt.hash("password123", 12);
    const demoUser = new UserModel({
      email: "test@example.com",
      password: hashedPassword,
      username: "TestUser",
      riskProfile: "Moderate",
      role: "User",
      balance: 100000.00
    });
    const savedUser = await demoUser.save();
    console.log("Seeded default user credentials: test@example.com / password123");

    // Clear existing global templates (userId: null)
    await HoldingsModel.deleteMany({ userId: null });
    await PositionsModel.deleteMany({ userId: null });

    // Seed holdings for fallback (userId: null)
    for (const h of tempHoldings) {
      const holding = new HoldingsModel({ ...h, userId: null });
      await holding.save();
    }
    
    // Seed holdings specifically for the demo user (userId: savedUser._id)
    await HoldingsModel.deleteMany({ userId: savedUser._id });
    for (const h of tempHoldings) {
      const holding = new HoldingsModel({ ...h, userId: savedUser._id });
      await holding.save();
    }
    console.log("Seeded default holdings!");

    // Seed positions for fallback (userId: null)
    for (const p of tempPositions) {
      const position = new PositionsModel({ ...p, userId: null });
      await position.save();
    }

    // Seed positions specifically for the demo user (userId: savedUser._id)
    await PositionsModel.deleteMany({ userId: savedUser._id });
    for (const p of tempPositions) {
      const position = new PositionsModel({ ...p, userId: savedUser._id });
      await position.save();
    }
    console.log("Seeded default positions!");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
