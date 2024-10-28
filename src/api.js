import axios from 'axios';

// Create an instance of axios with the base URL of the Flask API
const api = axios.create({
  baseURL: 'https://web-production-46a8.up.railway.app',
  // baseURL: "http://127.0.0.1:5000",
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
