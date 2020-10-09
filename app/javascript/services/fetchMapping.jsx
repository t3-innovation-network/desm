import apiService from "./api/apiService";

const fetchMapping = async (mapping_id) => {
  const response = await apiService
    .get("/api/v1/mappings/" + mapping_id);
  return {
    mapping: response.data,
  };
};

export default fetchMapping;
