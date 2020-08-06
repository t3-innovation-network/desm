import axios from 'axios';

const fetchUsers = () => {
  const baseURL = process.env.API_URL;

  return axios
    .get(baseURL + "/users", { withCredentials: true })
    .then((response) => {
      /// We have a list of users from the backend
      if (response.status == 200) {
        return response.data
      }
  })
}

export default fetchUsers;