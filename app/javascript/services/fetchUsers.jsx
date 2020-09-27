import apiService from "./apiService";

const fetchUsers = async () => {
  const response = await apiService.get("/users");
  /// We have a list of users from the backend
  if (response.status != 200) {
    return [];
  }
  return response.data;
};

export default fetchUsers;
