import axios from 'axios';

// VITE_API_URL should be set in .env / .env.production, e.g.:
//   .env            -> VITE_API_URL=http://localhost:8000/api
//   .env.production -> VITE_API_URL=https://code-and-class.onrender.com/api
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://code-and-class.onrender.com/api',
  withCredentials: true,
});

export default instance;