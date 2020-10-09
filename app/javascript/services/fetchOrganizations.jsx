import apiService from "./api/apiService";

const fetchOrganizations = async () => {
  const response = await apiService.get("/api/v1/organizations");
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return response.data;
};

export default fetchOrganizations;
