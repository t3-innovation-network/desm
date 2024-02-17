import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchAlignmentsForSpine = async (spineId) => {
  let response = await apiRequest({
    url: `/api/v1/alignments?spine_id=${spineId}`,
    method: 'get',
    successResponse: 'alignments',
    defaultResponse: [],
  });

  return camelizeKeys(response);
};

export default fetchAlignmentsForSpine;
