import apiRequest from "./api/apiRequest";

const createVocabulary = async (data) => {
  return await apiRequest({
    url: "/api/v1/vocabularies",
    method: "post",
    payload: data,
  });
};

export default createVocabulary;
