import React from "react";
import UI_Image from "../../assets/images/team_working.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen md:h-[60vh]">
      <div>
        <h1>Task Manager</h1>
        <p>login</p>
      </div>

      <div>
        <img src={UI_Image} alt="Task Manager" />
      </div>
    </div>
  );
};

export default AuthLayout;
