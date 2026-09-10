import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() ||
  "https://winstone-medical-center-1.onrender.com"
).replace(/^http:\/\//i, "https://");

export const getImageUrl = (value: string): string => {
  if (value.startsWith("http://")) {
    return `https://${value.slice("http://".length)}`;
  }

  if (value.startsWith("/")) {
    return `${API_BASE_URL.replace(/\/+$/, "")}${value}`;
  }

  return value;
};

const normalizeImageFields = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeImageFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const normalized = { ...(value as Record<string, unknown>) };

  for (const key of ["imageUrl", "imageUrls"]) {
    const field = normalized[key];

    if (typeof field === "string") {
      normalized[key] = getImageUrl(field);
    } else if (Array.isArray(field)) {
      normalized[key] = field.map((item) =>
        typeof item === "string"
          ? getImageUrl(item)
          : item
      );
    }
  }

  for (const [key, field] of Object.entries(normalized)) {
    if (key !== "imageUrl" && key !== "imageUrls") {
      normalized[key] = normalizeImageFields(field);
    }
  }

  return normalized;
};

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
  (response) => {
    response.data = normalizeImageFields(response.data);
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
        "API Network Error: No response received from backend."
      );
    } else {
      console.error("API Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;










