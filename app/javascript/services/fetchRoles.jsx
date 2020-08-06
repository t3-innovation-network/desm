import axios from 'axios';

const fetchRoles = () => {
  const baseURL = process.env.API_URL;

  return axios
    .get("/api/v1/roles", { withCredentials: true })
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

export default fetchRoles;