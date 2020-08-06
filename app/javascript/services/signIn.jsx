import axios from "axios";

const signIn = (email, password) => {
  const baseURL = process.env.API_URL;

  return axios
    .post(
      baseURL + "/sessions",
      {
        user: {
          email: email,
          password: password,
        },
      },
      /// Tells the API that's ok to get the cookie in our client
      { withCredentials: true }
    )
    .then((response) => {
      /// Return the user object
      return response.status == 200 ? response.data : {};
    });
};

export default signIn;
