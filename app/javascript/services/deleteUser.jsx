import apiService from "./apiService";

const deleteUser = (user_id) => {
  return apiService.delete("/users/" + user_id).then((response) => {
    /// We have a list of users from the backend
    if (response.data.status == "removed") {
      return { removed: true };
    }
  });
};

export default deleteUser;
