const Task = require("../models/Task");

//@dec      Get all task (Admin:all,user:Assigned)
//@route   GET-> /api/tasks/
//@access  Private
const getTask = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec       get task by Id
//@router    GET-> /api/task/:id
//@access    Private
const getTaskById = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec createTask
//route POST-> /api/task
//@access Private [admin only]
const createTask = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec  update task by id
//route PUT-> /api/task/:id
//@access private
const updateTask = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec  delete task by id
// route DELETE-> /api/task/:id
//@access private [admin only]
const deleteTask = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec  update task status
//route  PUT-> /api/task/:id/status
//@access private
const updateTaskStatus = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//@dec  update task  checklist
//route  PUT-> /api/task/:id/todo
//@access private
const updateTaskChecklist = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//@dec  Get Dashboard Data {Admin only}
//route  GET-> /api/task/dashboard-data
//@access private
const getDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//@dec  Get user-dashboard-data (user specific)
//route  GET-> /api/task/user-dashboard-data
//@access private
const getUserDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getUserDashboardData,
  updateTaskChecklist,
  updateTaskStatus,
  deleteTask,
  updateTask,
  createTask,
  getTask,
  getTaskById,
};
