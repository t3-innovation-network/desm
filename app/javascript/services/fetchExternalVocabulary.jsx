import apiRequest from "./api/apiRequest";

const fetchExternalVocabulary = async (vocabularyURL) => {
  return await apiRequest({
    url: vocabularyURL,
    method: "get",
    defaultResponse: {},
    successResponse: "vocabulary"
  });
};

export default fetchExternalVocabulary;
