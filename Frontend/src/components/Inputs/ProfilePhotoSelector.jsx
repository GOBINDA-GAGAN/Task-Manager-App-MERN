import React from "react";
import { FaRegUser } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { MdDelete } from "react-icons/md";

const ProfilePhotoSelector = ({ image, setImage }) => {
  return (
    <div className="relative mb-3">
      <div className="h-[70px] w-[70px] bg-[#d2d3f3] shadow-2xl shadow-purple-300 rounded-full items-center flex justify-center">
        <FaRegUser size={25} className="text-blue-500" />
      </div>

      <div className="bg-blue-500  rounded-full p-4 flex justify-center items-center w-[10px] h-[10px]  absolute -right-2 -bottom-1 ">
        <ImUpload size={20} className="text-white z-20 absolute " />
      </div>

      {/* <MdDelete size={25} className="text-red-500 absolute right-0 bottom-1" /> */}
    </div>
  );
};

export default ProfilePhotoSelector;
