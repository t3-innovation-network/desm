import apiService, { processMessage } from "./apiService";
/**
 * Manages the api requests
 *
 * The possible parameters are:
 *
 * - url: The relative url (without the base) to hit
 *
 * - method: The HTTP method (get, post, patch, put, delete)
 *
 * - [defaultResponse]: The default response if something bad happens but
 * we manage handle hit (it could be an empty string or an empty array).
 *
 * - [successResponse]: What to return if everything goes well. We have
 * the data, but if the caller expects to receive a named response, this
 * comes into play.
 *
 * - [payload]: The data to send in the request
 *
 * - [options]: Additional options like the collection of headers in an object format (not an array)
 *
 * @param {Object} props
 */
const apiRequest = async (props) => {
  validateParams(props);

  /// Do the request
  const response = await apiService({
    url: props.url,
    method: props.method,
    data: props.payload,
    options: props.options
  /// Process the errors globally
  }).catch((error) => {
    return {
      error: processMessage(error),
    };
  });

  // Return the respone object with an error
  if (response.error) {
    return response;
  }

  /// We don't have a valid response
  if (!response.data && response.status != 200) {
    return props.defaultResponse || null;
  }

  /// Default way to return the response obtained
  let responseData = response.data;

  /// If we are provided with a name to return the response with, let's do it
  if (props.successResponse) {
    responseData = {};
    responseData[props.successResponse] = response.data;
  }
  return responseData;
};

/**
 * Validate the parameters passed in props.
 *
 * @param {Object} props
 */
const validateParams = (props) => {
  if (!_.has(props, "url")) {
    throw "Url not provided";
  }
  if (!_.has(props, "method")) {
    throw "Method not provided";
  }
};

export default apiRequest;
