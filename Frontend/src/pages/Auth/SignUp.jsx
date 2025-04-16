import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [error, setError] = useState(null);

  //submit signup from data
  const handelSignUp = (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter your valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");
    console.log({
      fullName: fullName,
      email: email,
      password: password,
      profilePic: profilePic,
    });
  };
  return (
    <AuthLayout>
      <div className="flex justify-center items-center p-2 h-screen">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[#000000] text-4xl md:text-4xl lg:text-5xl font-semibold">
            Create Account
          </h1>
          <p className="text-center text-gray-500 italic mt-2">
            Build your future. It starts with one click.
          </p>
          <form
            onSubmit={handelSignUp}
            className="space-y-2 w-full md:w-[600px]  flex flex-col items-center mt-4 "
          >
            /* <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            ></ProfilePhotoSelector> */
            
            <div className=" grid  grid-cols-1 md:grid-cols-2 gap-4 w-full  mt-4">
              <Input
                className="w-full"
                type="text"
                placeholder="xyz@gmail.com"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                lable="Full name"
              />
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

              <Input
                type="text"
                placeholder="Enter your AccessToken"
                value={adminAccessToken}
                onChange={({ target }) => setAdminAccessToken(target.value)}
                lable="Access Token"
              />
            </div>

            {error && (
              <p className="text-red-500 text-start text-[13px]">{error}</p>
            )}
            <button type="submit" className="btn-primary mt-2 ">
              SIGN UP
            </button>
            <p className="text-[15px] mt-3 text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline font-medium">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
