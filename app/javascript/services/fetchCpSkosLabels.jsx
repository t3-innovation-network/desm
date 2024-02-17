import { camelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const fetchCPSkosLabels = async (cpId, skosMethod) => {
  let response = await apiRequest({
    url: `/api/v1/skos/labels?configuration_profile_id=${cpId}&skos_method=${skosMethod}`,
    method: 'get',
  });

  return camelizeKeys(response);
};

export default fetchCPSkosLabels;
