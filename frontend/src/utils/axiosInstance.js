import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true, // Enable sending cookies with requests
});

export const setupInterceptors = (setToken) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        try {
          const res = await axios.post(import.meta.env.VITE_BASE_URL + 'token/refresh/',{}, { withCredentials: true });
          const newToken = res.data.access;
          setToken(newToken);
          originalRequest._retry = true;
          console.log("Token refreshed successfully:", newToken);
          console.log("Session key:", res.data.session_key);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("Error refreshing token:", err);
          console.log("Clearing token due to refresh failure");
          setToken(null);
          return Promise.reject(err);
        }
      }
      console.log("Error in response interceptor:", error);
      setToken(null);
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;