import axios from 'axios';

const createUser = (
  fullname,
  email,
  organization_id,
  role_id
) => {
  const baseURL = process.env.API_URL;

  return axios
  .post(
    baseURL + "/registrations",
    {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id
      },
      role_id: role_id
    },
    /// Tells the API that's ok to get the cookie in our client
    { withCredentials: true }
  )
  .then((response) => {
      return { success: (response.status === 200) }
    }
  );
}

export default createUser;