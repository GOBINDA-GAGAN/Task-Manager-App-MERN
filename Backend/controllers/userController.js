const Task = require("../models/Task");

const User = require("../models/User");

// @desc     Get all tasks
//@router    [GET]=>/api/users/
//@access    private [admin]
const getUser = async () => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
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
const getUserById = async () => {
  try {
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

module.exports={getUser,deleteUserById,getUserById}