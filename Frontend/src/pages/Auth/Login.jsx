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
      
    </AuthLayout>
  );
};

export default Login;
