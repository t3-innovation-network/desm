import axios from 'axios';

const updateUser = (
  user_id,
  email,
  fullname,
  organization_id,
  role_id
) => {
  return axios
    .put(
      "http://localhost:3000/users/" + user_id,
      {
        user: {
          fullname: fullname,
          email: email,
          organization_id: organization_id,
        },
        role_id: role_id
      },
      /// Tells the API that's ok to get the cookie in our client
      { withCredentials: true }
    )
    .then((response) => {
      if (response.status === 200) {
        return {
          success: true
        }
      }
    })
}

export default updateUser;