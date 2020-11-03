import apiRequest from "./api/apiRequest";
import { shapeConcepts } from "./api/helper";

const fetchVocabularyConcepts = async (vocabId) => {
  const response = await apiRequest({
    url: "/api/v1/vocabularies/" + vocabId,
    defaultResponse: [],
    successResponse: "vocabulary",
    method: "get",
  });

  if (response.error) {
    return response;
  }

  return shapeConcepts(response.vocabulary.concepts);
};

export default fetchVocabularyConcepts;
