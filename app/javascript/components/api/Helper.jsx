import axios from 'axios';

export default {
  fetchOrganizations: () => {
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
      /// Process any server errors
      .catch((error) => {
        return "We had en error:" + error.message
      });
  }
}