import apiService from "./apiService";

const fetchVocabularies = async () => {
  const response = await apiService.get("/api/v1/vocabularies");
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return response.data;
};

export default fetchVocabularies;
