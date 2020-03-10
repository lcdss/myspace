import axios from 'axios';
import { navigate } from '@reach/router';

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

http.interceptors.response.use(
  response => response,
  error => {
    if (error.response === undefined) {
      console.warn('The API server is down');
    }

    if (error.response && error.response.status === 401) {
      navigate('/auth/login');
    }

    return Promise.reject(error);
  },
);

export default http;
