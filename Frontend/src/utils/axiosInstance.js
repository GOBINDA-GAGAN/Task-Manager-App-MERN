import axios from "axios";
import { BASE_URL } from "./apiPaths";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptors
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response  interceptors

axios.interceptors.response.use(
  (response) => {
    response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("server error , Please try again");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout, Please try again");
      }

      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
