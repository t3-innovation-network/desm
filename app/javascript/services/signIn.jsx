import apiService from "./apiService";

const signIn = async (email, password) => {
  const response = await apiService
    .post("/sessions", {
      user: {
        email: email,
        password: password,
      },
    });
  return response.status == 200 ? response.data : {};
};

export default signIn;
