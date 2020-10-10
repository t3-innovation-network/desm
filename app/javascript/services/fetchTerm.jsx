import apiRequest from "./api/apiRequest";

const fetchTerm = async (termId) => {
  return await apiRequest({
    url: "/api/v1/terms/" + termId,
    method: "get",
    defaultResponse: {},
    successResponse: "term",
  });
};

export default fetchTerm;
