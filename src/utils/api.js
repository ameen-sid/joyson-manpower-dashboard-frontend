import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on different port
    withCredentials: true, // Important for cookies
});

export default api;
