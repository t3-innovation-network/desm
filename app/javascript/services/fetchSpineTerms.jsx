import apiRequest from './api/apiRequest';

const fetchSpineTerms = async (specId, queryParams = {}) => {
  return await apiRequest({
    // spine_terms#index
    url: '/api/v1/spines/' + specId + '/terms',
    defaultResponse: [],
    successResponse: 'terms',
    method: 'get',
    camelizeKeys: true,
    queryParams,
  });
};

export default fetchSpineTerms;
