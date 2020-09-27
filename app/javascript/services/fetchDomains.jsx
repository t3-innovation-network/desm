import apiService from "./apiService";

const fetchDomains = async () => {
  const response = await apiService
    .get("/api/v1/domains");
  return response.data.map((domain) => {
    return {
      id: domain.uri,
      name: domain.pref_label,
      spine: (domain.spine_id !== null)
    };
  });
}

export default fetchDomains;