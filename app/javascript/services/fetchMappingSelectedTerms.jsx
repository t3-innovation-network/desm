import { camelizeKeys } from "humps";
import apiRequest from "./api/apiRequest";

const fetchMappingSelectedTerms = async (mappingId) => {
  let response = await apiRequest({
    url: "/api/v1/mappings/" + mappingId + "/selected_terms",
    method: "get",
    defaultResponse: [],
    successResponse: "terms",
  });

  return camelizeKeys(response);
};

export default fetchMappingSelectedTerms;
