import apiRequest from "./api/apiRequest";

const fetchVocabulary = async (vocabId) => {
  const response = await apiRequest({
    url: "/api/v1/vocabularies/" + vocabId,
    defaultResponse: [],
    successResponse: "vocabulary",
    method: "get"
  })
  return response;
};

export default fetchVocabulary;
