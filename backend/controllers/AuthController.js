const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

const signup = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      username, 
      riskProfile,
      mobile,
      pan,
      dob,
      bankAccount,
      ifsc,
      aadhaar,
      ipvVerified,
      eSignCompleted
    } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel({
      email,
      password: hashedPassword,
      username,
      riskProfile: riskProfile || "Moderate",
      role: "User",
      mobile,
      pan,
      dob,
      bankAccount,
      ifsc,
      aadhaar,
      ipvVerified: ipvVerified || false,
      eSignCompleted: eSignCompleted || false
    });

    await user.save();
    
    // Auto-login on signup by generating a token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        riskProfile: user.riskProfile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing up: " + error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        riskProfile: user.riskProfile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully", success: true });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile: " + error.message });
  }
};

const updateRiskProfile = async (req, res) => {
  try {
    const { riskProfile } = req.body;
    if (!["Conservative", "Moderate", "Aggressive"].includes(riskProfile)) {
      return res.status(400).json({ message: "Invalid risk profile value" });
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { riskProfile },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Risk profile updated successfully", success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error updating risk profile: " + error.message });
  }
};

module.exports = { signup, login, logout, getCurrentUser, updateRiskProfile };
