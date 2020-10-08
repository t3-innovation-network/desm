import apiService from "./apiService";

const fetchSpecificationTerms = async (specId) => {
  const response = await apiService
    .get("/api/v1/specifications/" + specId + "/terms")
    .catch((error) => {
      return {
        error: error,
      };
    });

  // Return the respone object with an error
  if (response.error) {
    return response;
  }
  /// We don't have a valid response
  if (response && response.status != 200) {
    return [];
  }
  /// We have our response, return in a proper way
  return {
    terms: response.data,
  };
};

export default fetchSpecificationTerms;
