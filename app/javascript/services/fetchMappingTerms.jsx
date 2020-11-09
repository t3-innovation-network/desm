import apiRequest from "./api/apiRequest";

const fetchMappingTerms = async (mappingId) => {
  return await apiRequest({
    url: "/api/v1/mappings/" + mappingId + "/terms",
    method: "get",
    defaultResponse: [],
    successResponse: "terms"
  });
};

export default fetchMappingTerms;
