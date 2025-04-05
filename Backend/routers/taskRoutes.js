const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);

router.get("/", protect, getTask); //get all task(user:assigned,admin:All)

router.get("/:id", protect, getTaskById); //get task by ID

router.post("/", protect, adminOnly, createTask); //create a task Admin only
router.put("/:id", protect, updateTask); //update task details

router.delete("/:id", protect, adminOnly, deleteTask); //Delete a Task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); //Update task status
router.put("/:id/todo", protect, updateTaskChecklist); //update task checklist

module.exports = router;
