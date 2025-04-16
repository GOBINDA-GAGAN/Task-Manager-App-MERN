import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const Input = ({ type, placeholder, value, onChange, lable }) => {
  const [showPassword, setShowPassword] = useState(true);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col gap-1">
      <label className=""> </label>
      {lable}
      <div className=" relative">
        <input
          type={
            type === "password" ? (showPassword ? "password" : "text") : "text"
          }
          placeholder={placeholder}
          className="p-2 border-black border rounded-sm w-full outline-none bg-gray-50"
          value={value}
          onChange={(e) => onChange(e)}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEyeSlash
                onClick={togglePassword}
                className=" absolute right-2 top-2  text-gray-500"
                size={25}
              />
            ) : (
              <IoEyeOutline
                onClick={togglePassword}
                className=" absolute right-2 top-2  text-blue-500"
                size={25}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
