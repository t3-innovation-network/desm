import axios from 'axios';

const fetchUser = (user_id) => {
  return axios
  .get("http://localhost:3000/users/" + user_id, {
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
      /// Something happened
    } else {
        return {
          error: "Couldn't retrieve user with id " + user_id + "!"
        };
    }
  })
}

export default fetchUser;