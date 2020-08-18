import axios from 'axios';

const apiService = axios.create({
  /// Tells the API that's ok to get the cookie in our client
  withCredentials: true,
  baseURL: process.env.API_URL
});

export default apiService;