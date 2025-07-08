import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_AWS_BACKEND_BASE_URL;

const instance = axios.create({         //instead of typing "http://localhost:5000/api" everytime, we can just request like api.get("/auth/login") but make sure to import api from "./axiosInstance"; I mean Import the configured instance with named "api"
  baseURL:  `${backendBaseUrl}/api`,  // Automatically uses AWS or localhost since it loads .env.local first for local dev otherwise reads .env for aws
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

