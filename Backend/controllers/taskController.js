const Task = require("../models/Task");

//@dec      Get all task (Admin:all,user:Assigned)
//@route   GET-> /api/tasks/
//@access  Private
const getTask = async (req, res) => {
  try {
    // Extracting status filter from query params
    const { status } = req.query;
    let filter = {};

    // If status is provided in the query, add it to the filter
    if (status) {
      filter.status = status;
    }

    let tasks;

    // If the logged-in user is an admin, fetch all tasks (with optional status filter)
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo", // Populate the 'assignedTo' field with user data
        "name email profileImage" // Select only these fields from the assigned user
      );
    } else {
      // For non-admin users, fetch only tasks assigned to them
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImage"
      );
    }

    // Add completedCount field to each task by counting completed checklist items
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed // Check if checklist item is completed
        ).length;
        return {
          ...task._doc, // Spread existing task data
          completedCount, // Add new field for completed checklist count
        };
      })
    );

    // Count total number of tasks for the logged-in user (admin sees all)
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    // Count pending tasks
    const pendingTask = await Task.countDocuments({
      ...filter,
      status: "pending", // Specifically look for pending status
      ...(req.user._id !== "admin" && {
        assignedTo: req.user._id, // If not admin, count only their tasks
      }),
    });

    // Count in-progress tasks
    const inProgress = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user._id !== "admin" && {
        assignedTo: req.user._id,
      }),
    });

    // Count completed tasks
    const completedTask = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user._id !== "admin" && {
        assignedTo: req.user._id,
      }),
    });

    // Send back the tasks and status summary as JSON
    res.status(200).json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTask,
        inProgress,
        completedTask,
      },
    });
  } catch (error) {
    // Handle and return any server errors
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec       get task by Id
//@router    GET-> /api/task/:id
//@access    Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo", 
      "name email profileImage"
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec createTask
//route POST-> /api/task
//@access Private [admin only]
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      attachments,
      todoCheckList,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "assign to must be an Array of user IDs",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: req.user._id,
      attachments,
      todoCheckList,
    });

    return res.status(201).json({ message: "create task successfully", task });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec  update task by id
//route PUT-> /api/task/:id
//@access private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Task not Found",
      });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.attachments = req.body.attachments || task.attachments;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "assign to must be an Array of user IDs",
        });
      }
      task.assignedTo = req.body.assignedTo || task.assignedTo;
    }

    await task.save();

    return res.status(200).json({
      message: "Task Update successfully",
      task,
    });
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
