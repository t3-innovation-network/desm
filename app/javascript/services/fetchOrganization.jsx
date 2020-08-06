import axios from 'axios';

const fetchOrganization = (
  organization_id
) => {
  const baseURL = process.env.API_URL;

  return axios
  .get(baseURL + "/api/v1/organizations/" + organization_id, {
    withCredentials: true,
  })
  .then((response) => {
    /// We have a list of organizations from the backend
    return {
      success: response.data.success,
      organization: response.data.organization
    }
  })
}

export default fetchOrganization;