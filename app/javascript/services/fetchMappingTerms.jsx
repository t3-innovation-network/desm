import apiService from "./apiService";

const fetchMappingsTerms = async (mappingId) => {
  const response = await apiService.get(
    "/api/v1/mappings/" + mappingId + "/terms"
  );
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return {
    terms: response.data,
  };
};

export default fetchMappingsTerms;
