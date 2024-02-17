import { decamelizeKeys } from 'humps';
import apiRequest from './api/apiRequest';

const execCPAction = async (id, action) => {
  let payload = decamelizeKeys({
    configurationProfile: {
      action: action,
    },
  });

  return await apiRequest({
    url: `/api/v1/configuration_profiles/${id}/action`,
    method: 'post',
    payload,
  });
};

export default execCPAction;
