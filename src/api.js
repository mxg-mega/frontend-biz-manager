import axios from 'axios';

// Create an instance of axios with the base URL of the Flask API
const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://127.0.0.1:5000",
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
