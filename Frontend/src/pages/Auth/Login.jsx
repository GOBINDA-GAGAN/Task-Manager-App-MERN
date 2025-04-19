import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { MdApi } from "react-icons/md";
import { API_PATH } from "../../utils/apiPaths";
import { userContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(userContext);
  const navigate = useNavigate();

  //submit  login from data
  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter your valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    //Login Api Call call the api   👍
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("some thing went wrong ,Please try");
      }
    }

    console.log({
      email: email,
      password: password,
    });
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center p-4 h-screen">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[#000000] text-4xl md:text-4xl lg:text-5xl font-semibold">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 italic mt-2">
            Let’s get to work!
          </p>
          <form
            onSubmit={handelSubmit}
            className="space-y-2 w-full flex flex-col justify-center mt-4 "
          >
            <Input
              className="w-full"
              type="text"
              placeholder="xyz@gmail.com"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              lable="Enter Address"
            />
            <Input
              type="password"
              placeholder="Min 8 character"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              lable="Password"
            />

            {error && (
              <p className="text-red-500 text-start text-[13px]">{error}</p>
            )}
            <button type="submit" className="btn-primary mt-2 ">
              LOGIN
            </button>
            <p className="text-[15px] mt-3 text-slate-600">
              Don't have account ?{" "}
              <Link
                to="/signup"
                className="text-blue-500 underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
