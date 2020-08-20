import apiService from "./apiService";

const signIn = (email, password) => {
  return apiService
    .post("/sessions", {
      user: {
        email: email,
        password: password,
      },
    })
    .then((response) => {
      /// Return the user object
      return response.status == 200 ? response.data : {};
    });
};

export default signIn;
