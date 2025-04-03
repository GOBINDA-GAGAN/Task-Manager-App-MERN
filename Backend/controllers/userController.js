const Task = require("../models/Task");

const User = require("../models/User");

// @desc     Get all tasks
//@router    [GET]=>/api/users/
//@access    private [admin]
const getUser = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    //Add task counts to each  user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgress = await Task.countDocuments({
          assignedTo: user._id,
          status: "In progress",
        });
        const completedTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, // Include all  existing  user data
          pendingTask,
          inProgress,
          completedTask,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc     Get user by ID
//@router [GET]=>/api/users/id
//@access private [admin]
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc     Delete user by ID
//@router [DELETE]=>/api/users/id
//@access private [admin]
const deleteUserById = async () => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { getUser, deleteUserById, getUserById };
