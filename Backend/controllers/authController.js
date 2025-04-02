const User = require("../models/User");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@ generated jwt token
const generatedToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @dec     Register a new user
// @route   [POST]-> /api/auth/register
// @access  public
const registerUser = async (req, res) => {};

// @dec     login a user
// @route   [POST]-> /api/auth/login
// @access  public
const loginUser = async (req, res) => {};

// @dec     get user profile
// @route   [GET]-> /api/auth/profile
// @access  private (require jwt)
const getUserProfile = async (req, res) => {};

// @dec     get user profile
// @route   [PUT]-> /api/auth/profile
// @access  private (require jwt)
const updateProfile = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateProfile };
