import axios from 'axios';

const fetchOrganizations = () => {
  const baseURL = process.env.API_URL;

  return axios
    .get(baseURL + "/api/v1/organizations", {
      withCredentials: true,
    })
    .then((response) => {
      /// We have a list of organizations from the backend
      if (response.data.success) {
        return response.data.organizations;
      }
    })
}

export default fetchOrganizations;