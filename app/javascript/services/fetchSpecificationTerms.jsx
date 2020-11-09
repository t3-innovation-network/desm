import apiRequest from "./api/apiRequest";

const fetchSpecificationTerms = async (specId) => {
  const response = await apiRequest({
    url: "/api/v1/specifications/" + specId + "/terms",
    defaultResponse: [],
    successResponse: "terms",
    method: "get"
  })
  return response;
};

export default fetchSpecificationTerms;
