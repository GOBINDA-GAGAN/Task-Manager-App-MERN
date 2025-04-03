const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

//Auth Router
router.post("/register", registerUser); //register user
router.post("/login", loginUser); //login user
router.get("/profile", protect, getUserProfile); //Get  user profile
router.put("/profile", protect, updateProfile); // update profile

// router.post("/upload-image", upload.signal("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   }
//   const imageUrl = `{req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;
//   res.json({ msg: "Image uploaded successfully", imageUrl });
// });

module.exports = router;
