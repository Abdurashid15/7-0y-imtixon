import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://frontend-mentor-apis-6efy.onrender.com',
});

export default axiosInstance;