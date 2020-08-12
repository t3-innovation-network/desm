import axios from 'axios';

const fetchOrganizations = () => {
  const baseURL = process.env.API_URL;

  return axios
    .get(baseURL + "/api/v1/organizations", {
      withCredentials: true,
    })
    .then((response) => {
      /// We don't have a valid response
      if (response.status != 200) {
        return [];
      }

      /// We have a list of organizations from the backend
      return response.data;
    })
}

export default fetchOrganizations;