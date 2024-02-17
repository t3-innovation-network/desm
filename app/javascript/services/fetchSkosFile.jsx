import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchSkosFile = async (uri) => {
  let response = await apiRequest({
    url: '/api/v1/skos/fetch',
    method: 'post',
    payload: {
      uri,
    },
  });

  return camelizeKeys(response);
};

export default fetchSkosFile;
