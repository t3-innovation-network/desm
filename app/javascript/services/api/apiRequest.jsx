import { camelizeKeys, decamelizeKeys } from 'humps';
import apiService, { processMessage } from './apiService';
import {
  chain,
  pickBy,
  identity,
  isArray,
  isEmpty,
  isNil,
  isObject,
  isString,
  map,
  mapValues,
  trim,
} from 'lodash';
/**
 * Manages the api requests
 *
 * The possible parameters are:
 *
 * - url: The relative url (without the base) to hit
 *
 * - method: The HTTP method (get, post, patch, put, delete)
 *
 * - camelizeKeys: If the response should be camelized or not, should become a default eventually
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
  const queryParams = queryString(props.queryParams || {});

  let data = props.formData ? props.payload : decamelizeKeys(props.payload || {});
  if (props.trimPayload) data = trimObject(data);

  // Do the request
  const response = await apiService({
    url: `${props.url}${queryParams ? `?${queryParams}` : ''}`,
    method: props.method,
    data,
    options: props.options,
  })
    // Process the errors globally
    // TODO: process authentication errors special way (logout the user, redirect to login page)
    .catch((error) => ({ error: processMessage(error) }));

  // Return the respone object with an error
  if (response.error) return response;

  // We don't have a valid response
  if (!response.data && response.status != 200) {
    return props.defaultResponse || null;
  }

  // Default way to return the response obtained
  let responseData = response.data;

  // If we are provided with a name to return the response with, let's do it
  if (props.successResponse) {
    responseData = {};
    responseData[props.successResponse] = response.data;
    responseData.contentType = response.headers['content-type'];
  }
  return props.camelizeKeys ? camelizeKeys(responseData) : responseData;
};

/**
 * Validate the parameters passed in props.
 *
 * @param {Object} props
 */
const validateParams = (props) => {
  if (!_.has(props, 'url')) {
    throw 'Url not provided';
  }
  if (!_.has(props, 'method')) {
    throw 'Method not provided';
  }
};

const queryString = (params) => {
  const esc = encodeURIComponent;
  const queryParams = pickBy(params, identity);

  return chain(decamelizeKeys(queryParams))
    .map((v, k) => {
      if (isNil(v)) return null;
      if (isArray(v)) {
        if (isEmpty(v)) return null;
        return v.map((p) => `${esc(k)}[]=${esc(p)}`).join('&');
      }
      return `${esc(k)}=${esc(v)}`;
    })
    .filter()
    .value()
    .join('&');
};

const trimObject = (obj) => {
  if (isString(obj)) return trim(obj);
  if (isArray(obj)) return map(obj, trimObject);
  if (isObject(obj)) return mapValues(obj, trimObject);
  return obj;
};

export default apiRequest;
