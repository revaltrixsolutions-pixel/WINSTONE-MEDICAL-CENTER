// src/api/axios.ts

import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Production / Vercel:
| VITE_API_URL=https://winstone-medical-center-1.onrender.com/api
|
| Local development:
| You can also set the same VITE_API_URL in your local .env file.
|
| If VITE_API_URL is missing, localhost is used as a fallback.
|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| Axios API Client
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 30000,

  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Keeps requests consistent and makes debugging easier.
|
*/

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| Gives useful console information when the backend returns an error.
|
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "API Network Error: No response received from backend.",
        error.request
      );
    } else {
      console.error(
        "API Request Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;