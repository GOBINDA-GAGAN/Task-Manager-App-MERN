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
    const task = await Task.findById(req.params.id);
    if (!task) {
      return (
        res.status(404),
        json({
          message: "task not found",
        })
      );
    }
    await task.deleteOne();

    res.status(200).json({
      message: "task delete successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@dec  update task status
//route  PUT-> /api/task/:id/status
//@access private
const updateTaskStatus = async (req, res) => {
  try {
    // Find the task by ID from the request params
    const task = await Task.findById(req.params.id);

    // If the task doesn't exist, return a 404 response
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Normalize the assignedTo field to always be an array
    const assignedUsers = Array.isArray(task.assignedTo)
      ? task.assignedTo
      : [task.assignedTo];

    // Check if the current user is assigned to this task
    const isAssigned = assignedUsers.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    // If the user is not assigned and is not an admin, block the request
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Update the task status only if it's provided in the request
    task.status = req.body.status || task.status;

    // If the status is updated to "Completed"
    if (task.status === "Completed") {
      // Mark all checklist items as completed
      task.todoCheckList.forEach((item) => {
        item.completed = true;
      });

      // Set the progress to 100%
      task.progress = 100;
    }

    // Save the updated task to the database
    await task.save();

    // Return a success response with the updated task
    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    // Catch and return any server error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@dec  update task  checklist
//route  PUT-> /api/task/:id/todo
//@access private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoCheckList } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(200).json({
        message: "task not found",
      });
    }

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "NOt a authorized to update the checkList",
      });
    }
    task.todoCheckList = todoCheckList;

    // Auto - update the  progress

    const completedCount = task.todoCheckList.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoCheckList.length;
    task.progress =
      totalItems > 0 ? Math.round(completedCount / totalItems) * 100 : 0;

    // auto-mark if the task is completed-> All checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress === 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    const updateTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImage"
    );
    res.status(200).json({
      message: "task  checkList update successfully",
      task: updateTask,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//@dec  Get Dashboard Data {Admin only}
//route  GET-> /api/task/dashboard-data
//@access private
const getDashboardData = async (req, res) => {
  try {
    // Count total number of tasks in the collection
    const totalTasks = await Task.countDocuments();

    // Count how many tasks have the status "Pending"
    const pendingTasks = await Task.countDocuments({ status: "Pending" });

    // Count how many tasks are marked as "Completed"
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    // Count tasks that are not completed and have due dates in the past (i.e., overdue)
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" }, // not equal to "Completed"
      dueDate: { $lt: new Date() }, // dueDate less than current date
    });

    // Define all possible statuses you want to track
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    // Group tasks by status and count how many fall under each
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status", // group by status field
          count: { $sum: 1 }, // count each group
        },
      },
    ]);

    // Format and map the result into a clean object with keys like Pending, InProgress, etc.
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // remove spaces for key naming
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc; // add key-value pair to accumulator object
    }, {});

    // Add a total count under the key "All"
    taskDistribution["All"] = totalTasks;

    // Define all possible priorities you want to track
    const taskPriorities = ["Low", "Medium", "High"];

    // Group tasks by priority and count how many fall under each
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority", // group by priority field
          count: { $sum: 1 }, // count each group
        },
      },
    ]);

    // Format the result into an object with priorities as keys
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc; // add key-value pair to accumulator
    }, {});

    // Fetch 10 most recently created tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 }) // sort by creation date, newest first
      .limit(10) // limit to 10 tasks
      .select("title status priority dueDate createdAt"); // return only these fields

    // Send back the complete dashboard data as JSON
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution, // task count by status
        taskPriorityLevels, // task count by priority
      },
      recentTasks, // list of 10 recent tasks
    });
  } catch (error) {
    // Catch and return error if anything fails
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//@dec  Get user-dashboard-data (user specific)
//route  GET-> /api/task/user-dashboard-data
//@access private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: {
        $ne: "Completed",
      },
      dueDate: {
        $lt: new Date(),
      },
    });

    //task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $match: { assignedTo: userId },
      },
      {
        $group: {
          _id: "$status", // group by status field
          count: { $sum: 1 }, // count each group
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // remove spaces for key naming
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc; // add key-value pair to accumulator object
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];

    // Group tasks by priority and count how many fall under each
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $match: { assignedTo: userId },
      },

      {
        $group: {
          _id: "$priority", // group by priority field
          count: { $sum: 1 }, // count each group
        },
      },
    ]);

    // Format the result into an object with priorities as keys
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc; // add key-value pair to accumulator
    }, {});

    // fetch recent 10 task for the login user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 }) // sort by creation date, newest first
      .limit(10) // limit to 10 tasks
      .select("title status priority dueDate createdAt"); // return only these fields
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution, // task count by status
        taskPriorityLevels, // task count by priority
      },
      recentTasks, // list of 10 recent tasks
    });
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
