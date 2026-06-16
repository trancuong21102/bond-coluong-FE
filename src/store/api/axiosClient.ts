import axios from 'axios';

// Get base URL from env or use default
const baseURL = "https://bond-coluong-api.onrender.com/api";
export const URL_IMAGE = "https://bond-coluong-api.onrender.com";
// const baseURL = "http://localhost:8386/api";
// export const URL_IMAGE = "http://localhost:8386";
export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // We could get token from localStorage, cookies, or Zustand store
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // In our case we have Zustand authStore but using localStorage is safer for interceptors
    // Or you can access the Zustand store directly if needed
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response.data, // Return data directly for convenience
  (error) => {
    // Handle global errors here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);
