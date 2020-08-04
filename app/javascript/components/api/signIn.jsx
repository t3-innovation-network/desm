import axios from 'axios';

const signIn = (
  email,
  password
) => {
 return axios
  .post(
    "http://localhost:3000/sessions",
    {
      user: {
        email: email,
        password: password
      }
    },
    /// Tells the API that's ok to get the cookie in our client
    { withCredentials: true }
  )
  .then((response) => {
    return response.data;
  })
}

export default signIn;