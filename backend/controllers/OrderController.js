const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { UserModel } = require("../model/UserModel");

const getHoldings = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let userHoldings = [];
    if (userId) {
      userHoldings = await HoldingsModel.find({ userId });
    }
    
    // If user has no holdings, return default global/template holdings (userId: null)
    if (userHoldings.length === 0) {
      const templateHoldings = await HoldingsModel.find({ userId: null });
      return res.status(200).json(templateHoldings);
    }
    
    res.status(200).json(userHoldings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching holdings: " + error.message });
  }
};

const getPositions = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let userPositions = [];
    if (userId) {
      userPositions = await PositionsModel.find({ userId });
    }
    
    if (userPositions.length === 0) {
      const templatePositions = await PositionsModel.find({ userId: null });
      return res.status(200).json(templatePositions);
    }
    
    res.status(200).json(userPositions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching positions: " + error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      const allOrders = await OrdersModel.find({ userId: null });
      return res.status(200).json(allOrders);
    }
    const userOrders = await OrdersModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders: " + error.message });
  }
};

const executeOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const orderQty = Number(qty);
    const orderPrice = Number(price);
    const cost = orderQty * orderPrice;

    // Fetch user if logged in
    let userObj = null;
    if (userId) {
      userObj = await UserModel.findById(userId);
    }

    // Adjust user holdings dynamically
    let holding = await HoldingsModel.findOne({ name, userId });

    // If user has no custom holding yet, but a global template holding exists,
    // we want to clone the template holding for this user or create a new one.
    if (!holding && userId) {
      // Find template
      const template = await HoldingsModel.findOne({ name, userId: null });
      if (template) {
        // Clone it
        holding = new HoldingsModel({
          userId,
          name: template.name,
          qty: template.qty,
          avg: template.avg,
          price: template.price,
          net: template.net,
          day: template.day,
        });
      }
    }

    if (mode.toUpperCase() === "BUY") {
      // Validate balance
      if (userId && userObj) {
        const currentBalance = userObj.balance !== undefined ? userObj.balance : 100000.00;
        if (currentBalance < cost) {
          return res.status(400).json({ message: "Insufficient balance to place this order" });
        }
        userObj.balance = Number((currentBalance - cost).toFixed(2));
        await userObj.save();
      }

      if (holding) {
        const oldCost = holding.qty * holding.avg;
        const newCost = orderQty * orderPrice;
        const newQty = holding.qty + orderQty;
        holding.avg = Number(((oldCost + newCost) / newQty).toFixed(2));
        holding.qty = newQty;
        await holding.save();
      } else {
        holding = new HoldingsModel({
          userId,
          name,
          qty: orderQty,
          avg: orderPrice,
          price: orderPrice,
          net: "0.00%",
          day: "0.00%",
        });
        await holding.save();
      }
    } else if (mode.toUpperCase() === "SELL") {
      if (!holding) {
        return res.status(400).json({ message: "No holdings found for this instrument" });
      }
      if (holding.qty < orderQty) {
        return res.status(400).json({ message: "Insufficient quantity to sell" });
      }

      // Add to balance
      if (userId && userObj) {
        const currentBalance = userObj.balance !== undefined ? userObj.balance : 100000.00;
        userObj.balance = Number((currentBalance + cost).toFixed(2));
        await userObj.save();
      }

      holding.qty -= orderQty;
      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    }

    // Save new order
    const newOrder = new OrdersModel({
      userId,
      name,
      qty: orderQty,
      price: orderPrice,
      mode: mode.toUpperCase(),
    });
    await newOrder.save();

    res.status(200).json({ message: "Order executed successfully", success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Order execution failed: " + error.message });
  }
};

module.exports = { getHoldings, getPositions, getOrders, executeOrder };
