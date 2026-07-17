import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "cursorline_token";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const json = response.data;
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      response.data = json.data;
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.errors?.[Object.keys(error.response?.data?.errors ?? {})[0] ?? ""]?.[0] ??
      "Request failed";
    return Promise.reject(new Error(message));
  },
);
