import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchAlignmentVocabulary = async (alignmentId) => {
  let response = await apiRequest({
    url: '/api/v1/alignments/' + alignmentId + '/vocabulary',
    method: 'get',
    defaultResponse: [],
    successResponse: 'alignmentConcepts',
  });

  return camelizeKeys(response);
};

export default fetchAlignmentVocabulary;
