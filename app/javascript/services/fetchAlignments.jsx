import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchAlignments = async (mappingId) => {
  let response = await apiRequest({
    // mappings#show_terms
    url: '/api/v1/mappings/' + mappingId + '/terms',
    method: 'get',
    defaultResponse: [],
    successResponse: 'alignments',
  });

  return camelizeKeys(response);
};

export default fetchAlignments;
