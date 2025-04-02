const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//middleware to protect route

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } else
      res.status(401).json({
        message: " not authorized,no token",
      });
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};

// middleware for Only-Admin

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Admin only ,access denied",
      error: error.message,
    });
  }
};


module.exports={protect,adminOnly}