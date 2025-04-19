import React, { createContext, useState, useEffect, Children } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";

export const userContext = createContext();

const userProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("user not authenticate", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <userContext.Provider value={(user, loading, updateUser, clearUser)}>
      {children}
    </userContext.Provider>
  );
};

export default userProvider;
