import apiService from "./apiService";

const fetchTerm = async (termId) => {
  const response = await apiService.get("/api/v1/terms/" + termId);
  /// We don't have a valid response
  if (response.status != 200) {
    return {};
  }
  return response.data;
};

export default fetchTerm;
