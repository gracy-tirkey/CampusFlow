import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000, // ⏱ prevent hanging requests
});

// ---------------- REQUEST INTERCEPTOR ----------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prevent accidental duplicate calls (optional future use)
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => {
    // Optional: log slow requests
    const duration =
      new Date() - response.config.metadata?.startTime;

    if (duration > 2000) {
      console.warn("🐢 Slow API:", response.config.url, duration + "ms");
    }

    return response;
  },
  (error) => {
    // ---------------- NETWORK ERROR ----------------
    if (!error.response) {
      console.error("🌐 Network error:", error.message);
      return Promise.reject({
        message: "Network error. Check your connection.",
      });
    }

    const { status, data } = error.response;

    // ---------------- AUTH ERROR ----------------
    if (status === 401) {
      localStorage.removeItem("token");

      // avoid infinite redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // ---------------- SERVER ERROR ----------------
    if (status === 500) {
      console.error("🔥 Server error:", data?.message);
    }

    // Normalize error
    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
    });
  }
);

export default API;