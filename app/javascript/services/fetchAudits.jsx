import apiRequest from './api/apiRequest';
import queryString from 'query-string';
import { decamelizeKeys } from 'humps';

const fetchAudits = async (filters) => {
  /**
   * Build the string filter to pass to the HTTP GET operation
   *
   * @param {Object} filters
   */
  const buildFilter = (filters) => {
    /// Use decamelized parameter names ffor the backend (underscored)
    const query = decamelizeKeys(filters);

    /// Return the filter in a query string format
    return queryString.stringify(query, { arrayFormat: 'comma' });
  };

  if (_.isEmpty(filters)) throw 'No parameters received';

  return await apiRequest({
    url: '/api/v1/audits?' + buildFilter(filters),
    method: 'get',
    successResponse: 'audits',
  });
};

export default fetchAudits;
