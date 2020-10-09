import apiGet from "./apiGet";

const fetchSpecificationTerms = async (specId) => {
  const response = await apiGet({
    uri: "/api/v1/specifications/" + specId + "/terms",
    defaultResponse: [],
    successResponse: "terms"
  })
  return response;
};

export default fetchSpecificationTerms;
