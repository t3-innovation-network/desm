import apiService from "./api/apiService";

const fetchSpecification = async (specId) => {
  const response = await apiService.get("/api/v1/specifications/" + specId);
  /// We don't have a valid response
  if (response.status != 200) {
    return {};
  }
  return {
    specification: response.data
  }
};

export default fetchSpecification;
