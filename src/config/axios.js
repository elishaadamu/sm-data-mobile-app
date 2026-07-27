import axios from 'axios';
import { API_CONFIG } from './api';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      console.log('Unauthorized - session may have expired');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
