import axios from 'axios';

const fetchUser = (user_id) => {
  const baseURL = process.env.API_URL;

  return axios
  .get(baseURL + "/users/" + user_id, {
    withCredentials: true,
  })
  .then((response) => {
    /// We have a list of users from the backend
    if (response.status === 200) {
      return { 
        user: {
          fullname: response.data.fullname,
          email: response.data.email,
          organization_id: response.data.organization_id,
          role_id: response.data.assignments[0].role_id
        }
      }
    }
  })
}

export default fetchUser;