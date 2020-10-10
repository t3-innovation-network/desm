import apiRequest from "./api/apiRequest";

const createMappingTerms = async (data) => {
  return await apiRequest({
    url: "/api/v1/mappings/terms",
    method: "post",
    payload: {
      terms: data.terms,
      mapping_id: data.mappingId,
    },
  });
};

export default createMappingTerms;
