import axios from 'axios';
import { APP_DOMAIN } from '../../helpers/Constants';

const apiService = axios.create({
  // Tells the API that's ok to get the cookie in our client
  withCredentials: true,
  baseURL: APP_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Process the message to show it properly
 * @param {Error} e
 */
export const processMessage = (e) => {
  // Override default message with the generic from the error object
  return e.response?.data?.message || e.response?.data?.error || e.message || 'We found an error!';
};

export default apiService;
