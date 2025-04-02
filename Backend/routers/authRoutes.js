const express = require("express");
const { registerUser, loginUser, getUserProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

//Auth Router
router.post("/register", registerUser); //register user
router.post("/login",loginUser); //login user
router.get("/profile", protect, getUserProfile); //Get  user profile
router.put("/profile", protect, updateProfile); // update profile

module.exports = router;
