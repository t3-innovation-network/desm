import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const saveAlignments = async (mappingId, data, params) => {
  return await apiRequest({
    url: `/api/v1/mappings/${mappingId}/alignments`,
    method: 'post',
    payload: {
      alignments: decamelizeKeys(data),
      params: decamelizeKeys(params),
    },
    camelizeKeys: true,
  });
};

export default saveAlignments;
