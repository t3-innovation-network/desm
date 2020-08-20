import apiService from "./apiService";

const fetchOrganizations = () => {
  return apiService.get("/api/v1/organizations").then((response) => {
    /// We don't have a valid response
    if (response.status != 200) {
      return [];
    }
    /// We have a list of organizations from the backend
    return response.data;
  });
};

export default fetchOrganizations;
