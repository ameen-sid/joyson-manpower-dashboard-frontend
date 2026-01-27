import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`, // Adjust if backend runs on different port
    withCredentials: true, // Important for cookies
});

export default api;
