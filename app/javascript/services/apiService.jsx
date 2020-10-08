import axios from "axios";

const apiService = axios.create({
  /// Tells the API that's ok to get the cookie in our client
  withCredentials: true,
  baseURL: process.env.API_URL,
});

apiService.interceptors.request.use(
  (config) => {
    console.log("sending request...");
    console.log("config: " + config);
    return config;
  },
  (e) => {
    /// Default error message
    let message = "We found an error!";

    /// Override default message with the generic from the error object
    if (e.message) {
      message = e.message;
    }

    /// Override the genric message with a specific from the service, if we found one
    if (e.response && e.response.data && e.response.data.message) {
      message = e.response.data.message;
    }

    // Throw the message so we can handle it in a superior level
    throw new Error(message);
  }
);

export default apiService;
