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
const registerUser = async (req, res) => {
  try {
    const { userName, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    // check if user already exists
    const userExits = await User.findOne({ email });
    if (userExits) {
      res.status(400).json({
        message: "User already Exist",
      });
    }

    //determine user role : Admin if correct token is provided,otherWise Member
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //create a new user
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      profileImageUrl,
      role,
    });

    //return user data

    return res.status(201).json({
      _id: user._id,
      name: user.userName,
      role: user.role,
      email: user.email,
      password: user.password,
      imageUrl: user.profileImageUrl,
      token: generatedToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// @dec     login a user
// @route   [POST]-> /api/auth/login
// @access  public
const loginUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// @dec     get user profile
// @route   [GET]-> /api/auth/profile
// @access  private (require jwt)
const getUserProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// @dec     get user profile
// @route   [PUT]-> /api/auth/profile
// @access  private (require jwt)
const updateProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateProfile };
