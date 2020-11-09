import apiRequest from "./api/apiRequest";

const fetchMappingSelectedTerms = async (mappingId) => {
  return await apiRequest({
    url: "/api/v1/mappings/" + mappingId + "/selected_terms",
    method: "get",
    defaultResponse: [],
    successResponse: "terms"
  });
};

export default fetchMappingSelectedTerms;
