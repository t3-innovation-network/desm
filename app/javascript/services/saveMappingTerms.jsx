import apiService from "./apiService";

const saveMappingTerms = async (data) => {
  const response = await apiService.post("/api/v1/mappings/terms", {
    terms: data.terms,
    mapping_id: data.mappingId,
  });
  return response.data;
};

export default saveMappingTerms;
