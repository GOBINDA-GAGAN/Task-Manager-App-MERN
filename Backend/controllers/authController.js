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
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    return res.status(200).json({
      message: "user login successfully",
      _id: user._id,
      userName: user.userName,
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

// @dec     get user profile
// @route   [GET]-> /api/auth/profile
// @access  private (require jwt)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// @dec     get user profile
// @route   [PUT]-> /api/auth/profile
// @access  private (require jwt)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userName = req.body.userName || user.userName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      password: updatedUser.password,
      profileImageUrl: updatedUser.profileImageUrl,
      role: updatedUser.role,
      token: generatedToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateProfile };
