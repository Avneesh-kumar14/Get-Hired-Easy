import { HOST } from "@/utils/constants";
import axios from "axios";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show errors that are already handled by the caller
    // Just pass the error through so the component can handle it
    return Promise.reject(error);
  }
);

// Request interceptor can log non-sensitive info if needed
apiClient.interceptors.request.use(
  (config) => {
    // Don't log URLs that contain localhost
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
