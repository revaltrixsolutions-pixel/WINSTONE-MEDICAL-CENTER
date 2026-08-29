import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://winstone-medical-center-1.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "API Network Error: No response received from backend."
      );
    } else {
      console.error("API Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;