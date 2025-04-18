import React from "react";
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
 import ManageTasks from "./pages/Admin/ManageTasks";
 import CreateTask  from "./pages/Admin/CreateTask";
 import ManageUsers from "./pages/Admin/ManageUsers"

import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetails"

import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/*Admin routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>


          {/*User routes*/}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard/>} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>


        </Routes>
      </Router>
    </div>
  );
};

export default App;
