import axios from 'axios';

const fetchOrganizations = () => {
  return axios
    .get("http://localhost:3000/api/v1/organizations", {
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