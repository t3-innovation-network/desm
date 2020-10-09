import apiService from "./api/apiService";

async function fetchUser(user_id) {
  const response = await apiService.get("/users/" + user_id);
  /// We have a list of users from the backend
  if (response.status === 200) {
    return {
      user: {
        fullname: response.data.fullname,
        email: response.data.email,
        organization_id: response.data.organization_id,
        role_id: response.data.assignments[0].role_id,
      },
    };
  }
}

export default fetchUser;
