import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.197.225.62:8000/api', // Cambia la URL por la de tu backend Laravel
  withCredentials: true,
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;