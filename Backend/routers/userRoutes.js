const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getUser,
  getUserById,
  deleteUserById,
} = require("../controllers/userController");
const express = require("express");

const router = express.Router();

router.get("/", protect, adminOnly, getUser);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUserById);

module.exports = router;
