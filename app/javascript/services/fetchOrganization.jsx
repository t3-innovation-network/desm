import axios from 'axios';

const fetchOrganization = (
  organization_id
) => {
  return axios
  .get("http://localhost:3000/api/v1/organizations/" + organization_id, {
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