import axios from 'axios';
import Cookies from 'js-cookie'; // Use js-cookie to manage cookies

// Create base Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api', 
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry Config
const MAX_RETRIES = 3;
const RETRY_DELAYS = [500, 1000, 2000]; // ms

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attach token from cookies if available
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // If no config (unexpected error), reject immediately
    if (!config) {
      return Promise.reject(error);
    }

    // Set initial retry count
    config.__retryCount = config.__retryCount || 0;

    // Edge case: Don't retry for client errors (4xx), except maybe 408 (timeout)
    const status = response?.status;
    if (status && (status < 500 && status !== 408)) {
      return Promise.reject(error);
    }

    // Retry only if under max retries
    if (config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      
      // Calculate retry delay
      const delay = RETRY_DELAYS[config.__retryCount - 1] || 2000; 
      
      await new Promise(resolve => setTimeout(resolve, delay));

      return apiClient(config);
    }

    // If retries exceeded, reject
    return Promise.reject(error);
  }
);

export default apiClient;
