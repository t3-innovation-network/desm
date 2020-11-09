import apiRequest from "./api/apiRequest";
import { shapeConcepts } from "./api/helper";

const fetchAlginmentVocabulary = async (mTermId) => {
  const response = await apiRequest({
    url: "/api/v1/mapping_terms/" + mTermId + "/vocabulary",
    method: "get",
    defaultResponse: [],
    successResponse: "vocabulary",
  });

  if (response.error) {
    return response;
  }

  return response.vocabulary.concepts.map((alignment) => {
    return {
      id: alignment.id,
      predicate_id: alignment.predicate_id,
      spine_concept_id: alignment.spine_concept_id,
      alignment_vocabulary_id: alignment.alignment_vocabulary_id,
      mapped_concepts: shapeConcepts(alignment.mapped_concepts),
    };
  });
};

export default fetchAlginmentVocabulary;
