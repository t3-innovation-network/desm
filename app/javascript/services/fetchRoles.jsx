import apiService from "./apiService";

const fetchRoles = () => {
  return apiService.get("/api/v1/roles").then((response) => {
    /// We don't have a valid response
    if (response.status != 200) {
      return [];
    }
    /// We have a list of roles from the backend
    return response.data;
  });
};

export default fetchRoles;
