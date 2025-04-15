import React from "react";
import UI_Image from "../../assets/images/LoginPageImage.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-[#FFFFFF ] flex justify-center items-center">
      <div className="grid grid-cols-2 rounded-3xl min-h-screen justify-between items-center">
        <div className="w-full">{children}</div>

        <img
          src={UI_Image}
          alt="Task Manager"
          className="h-screen object-center object-cover hidden lg:block"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
