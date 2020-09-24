import apiService from "./apiService";

const createVocabulary = async (data) => {
  const response = await apiService
    .post("/api/v1/vocabularies", data);
  return response.data;
};

export default createVocabulary;
