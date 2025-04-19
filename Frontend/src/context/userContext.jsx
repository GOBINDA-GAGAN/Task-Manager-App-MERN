import React, { createContext, useState, useEffect, Children } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";

export const userContext = createContext();

const useProvider = ({ Children }) => {};

export default useProvider;
