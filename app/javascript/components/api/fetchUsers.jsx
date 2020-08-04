import axios from 'axios';

const fetchUsers = () => {
  return axios
    .get("http://localhost:3000/users", { withCredentials: true })
    .then((response) => {
      /// We have a list of users from the backend
      if (response.status == 200) {
        return response.data
      }
  })
}

export default fetchUsers;