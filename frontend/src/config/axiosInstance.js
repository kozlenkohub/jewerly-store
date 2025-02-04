import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use your backend URL from the environment
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const lang = localStorage.getItem('lang') || 'en';
    config.headers['Accept-Language'] = lang;

    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle response data if needed
    return response;
  },
  (error) => {
    // Handle response errors if needed
    return Promise.reject(error);
  },
);

export default axiosInstance;
