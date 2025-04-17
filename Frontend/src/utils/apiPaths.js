export const BASE_URL = "http://localhost:8080";

export const API_PATH = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/task/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
    GET_ALL_TASKS: "/api/task/",
    GET_TASK_BY_ID: (taskId = `/api/task/${taskId}`),
    CREATE_TASK: "/api/task/",
    UPDATE_TASK: (taskId = `/api/task/${taskId}`),
    DELETE_TASK: (taskId = `/api/task/${taskId}`),
    UPDATE_TASK_STATUS: (taskId = `/api/task/${taskId}/status`),
    UPDATE_TASK_TODO: (taskId = `/api/task/${taskId}/todo`),
  },




};
