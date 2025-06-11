import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // adapte si ton backend change d'URL
});

// Intercepteur pour ajouter automatiquement le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
