import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //submit  login from data
  const handelSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter your valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
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
          <h1 className="text-[#000000] text-5xl font-semibold">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 italic mt-2">
            Let’s get to work!
          </p>
          <form
            onSubmit={handelSubmit}
            className="space-y-2 w-full flex flex-col justify-center mt-4 "
          >
            

            
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
