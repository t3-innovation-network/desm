import apiService from "./apiService";

const deleteUser = async (user_id) => {
  const response = await apiService.delete("/users/" + user_id);
  /// We have a list of users from the backend
  if (response.data.status == "removed") {
    return { removed: true };
  }
};

export default deleteUser;
