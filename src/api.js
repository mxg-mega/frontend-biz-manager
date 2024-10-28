import axios from 'axios';

// Create an instance of axios with the base URL of the Flask API
const api = axios.create({
  baseURL: 'https://web-production-46a8.up.railway.app',  // Update this if your backend runs on a different port
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
