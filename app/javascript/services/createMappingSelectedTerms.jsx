import apiRequest from "./api/apiRequest";

const createMappingSelectedTerms = async (data) => {
  return await apiRequest({
    url: "/api/v1/mappings/selected_terms",
    method: "post",
    payload: {
      terms: data.terms,
      mapping_id: data.mappingId,
    },
  });
};

export default createMappingSelectedTerms;
