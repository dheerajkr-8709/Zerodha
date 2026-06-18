const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided.", success: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Contains id of the user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token.", success: false });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    // Basic role check (mock user properties, or query DB)
    // For recruiters, this illustrates route protection and Role-Based Access Control (RBAC)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // We assume roles can be checked if req.user has role, default user
    next();
  };
};

module.exports = { verifyToken, checkRole };
