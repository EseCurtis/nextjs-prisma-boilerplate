import axios from 'axios';

export const ApiClient = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});