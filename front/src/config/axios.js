import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

export default AxiosClient;