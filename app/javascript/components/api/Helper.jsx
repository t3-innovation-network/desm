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
    },

  fetchUsers: () => {
    return axios
      .get("http://localhost:3000/users", { withCredentials: true })
      .then((response) => {
        /// We have a list of users from the backend
        if (response.status == 200) {
          return response.data
        } else {
          /// Something happened
          return "Couldn't retrieve users!";
        }
      })
  },

  fetchRoles: () => {
    return axios
      .get("http://localhost:3000/api/v1/roles", { withCredentials: true })
      .then((response) => {
        /// We have a list of roles from the backend
        if (response.status == 200) {
          return response.data
        } else {
          /// Something happened
          return "Couldn't retrieve roles!";
        }
      })
  }
}