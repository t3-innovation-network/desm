import apiService from "./api/apiService";

const fetchRoles = async () => {
  const response = await apiService.get("/api/v1/roles");
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return response.data;
};

export default fetchRoles;
