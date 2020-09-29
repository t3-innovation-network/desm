import apiService from "./apiService";

const fetchSpecificationTerms = async (specId) => {
  const response = await apiService.get("/api/v1/specifications/" + specId + "/terms");
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return {
    terms: response.data
  }
};

export default fetchSpecificationTerms;
