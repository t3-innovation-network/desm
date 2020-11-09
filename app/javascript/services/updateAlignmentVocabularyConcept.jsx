import apiRequest from "./api/apiRequest";

const updateAlignmentVocabularyConcept = async (data) => {
  return await apiRequest({
    url: "/api/v1/alignment_vocabulary_concepts/" + data.id,
    method: "put",
    payload: {
      alignment_vocabulary_concept: data,
    },
  });
};

export default updateAlignmentVocabularyConcept;
