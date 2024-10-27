import axios from 'axios';

// Create an instance of axios with the base URL of the Flask API
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // Update this if your backend runs on a different port
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
