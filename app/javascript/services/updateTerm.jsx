import apiRequest from "./api/apiRequest";

const updateTerm = async (term) => {
  return await apiRequest({
    url: "/api/v1/terms/" + term.id,
    method: "put",
    payload: {
      term: {
        name: term.name,
        property_attributes: term.property,
        vocabulary_ids: term.vocabularies.map((v) => v.id),
      },
    },
  });
};

export default updateTerm;
