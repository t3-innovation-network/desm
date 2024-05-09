import apiRequest from './api/apiRequest';

const fetchAlignmentsForSpine = async (queryParams = {}) => {
  return await apiRequest({
    url: '/api/v1/alignments',
    method: 'get',
    successResponse: 'alignments',
    defaultResponse: [],
    camelizeKeys: true,
    queryParams,
  });
};

export default fetchAlignmentsForSpine;
