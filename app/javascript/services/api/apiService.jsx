import axios from 'axios';
import { APP_DOMAIN } from '../../helpers/Constants';

const apiService = axios.create({
  /// Tells the API that's ok to get the cookie in our client
  withCredentials: true,
  baseURL: APP_DOMAIN,
});

/**
 * Process the message to show it properly
 * @param {Error} e
 */
export const processMessage = (e) => {
  /// Default error message
  let message = 'We found an error!';

  /// Override default message with the generic from the error object
  if (e.message) {
    message = e.message;
  }

  /// Override the genric message with a specific from the service, if we found one
  if (e.response && e.response.data && e.response.data.message) {
    message = e.response.data.message;
  }

  return message;
};

export default apiService;
