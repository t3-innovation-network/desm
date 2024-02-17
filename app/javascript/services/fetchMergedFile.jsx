import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchMergedFile = async (mergedFileId) => {
  let response = await apiRequest({
    url: '/api/v1/merged_files/' + mergedFileId,
    method: 'get',
    defaultResponse: {},
    successResponse: 'mergedFile',
  });

  return camelizeKeys(response);
};

export default fetchMergedFile;
