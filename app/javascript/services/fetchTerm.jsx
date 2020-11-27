import { camelizeKeys } from "humps";
import apiRequest from "./api/apiRequest";

const fetchTerm = async (termId) => {
  let response = await apiRequest({
    url: "/api/v1/terms/" + termId,
    method: "get",
    defaultResponse: {},
    successResponse: "term",
  });

  return camelizeKeys(response);
};

export default fetchTerm;
