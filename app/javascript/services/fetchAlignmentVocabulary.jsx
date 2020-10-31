import apiRequest from "./api/apiRequest";

const fetchAlginmentVocabulary = async (mTermId) => {
  return await apiRequest({
    url: "/api/v1/mapping_terms/" + mTermId + "/vocabulary",
    method: "get",
    defaultResponse: [],
    successResponse: "vocabulary"
  });
};

export default fetchAlginmentVocabulary;
