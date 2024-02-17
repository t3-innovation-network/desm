import apiRequest from './api/apiRequest';

const createSyntheticVocabularyConcept = async (data) => {
  return await apiRequest({
    url: '/api/v1/alignment_synthetic_concepts/',
    method: 'post',
    payload: {
      synthetic: data,
    },
  });
};

export default createSyntheticVocabularyConcept;
