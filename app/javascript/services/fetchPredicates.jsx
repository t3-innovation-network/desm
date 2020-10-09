import apiService from "./apiService";

const fetchPredicates = async () => {
  const response = await apiService.get("/api/v1/predicates");
  /// We don't have a valid response
  if (response.status != 200) {
    return [];
  }
  return {
    predicates: response.data
  }
};

export default fetchPredicates;
