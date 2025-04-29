import apiClient from '../utils/axios.js'; // Import the customized Axios instance

// API wrapper with clean methods
const api = {
  // GET request
  get: async (url, params = {}) => {
    return await apiClient
      .get(url, { params })
      .then(response => response.data)
      .catch(error => {
        throw error; // Propagate error to handle at the component level
      });
  },

  // POST request
  post: async (url, data) => {
    return await apiClient
      .post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error; // Propagate error
      });
  },

  // PUT request
  put: async (url, data) => {
    return await apiClient
      .put(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error; // Propagate error
      });
  },

  // DELETE request
  delete: async (url) => {
    return await apiClient
      .delete(url)
      .then(response => response.data)
      .catch(error => {
        throw error; // Propagate error
      });
  },
};

export default api;
