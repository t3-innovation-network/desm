import apiService from "./api/apiService";

const fetchMappings = async (filter) => {
  const response = await apiService
    .get("/api/v1/mappings", {
      params: {
        user: filter
      }
    });
  return {
    mappings: response.data,
  };
};

export default fetchMappings;
