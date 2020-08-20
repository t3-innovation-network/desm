import apiService from "./apiService";

const fetchUsers = () => {
  return apiService.get("/users").then((response) => {
    /// We have a list of users from the backend
    if (response.status != 200) {
      return [];
    }
    /// We have a list of users from the backend
    return response.data;
  });
};

export default fetchUsers;
