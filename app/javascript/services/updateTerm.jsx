import apiService from "./api/apiService";

const updateTerm = async (term) => {
  const response = await apiService.put("/api/v1/terms/" + term.id, {
    term: {
      name: term.name,
      property_attributes: term.property,
      vocabulary_ids: term.vocabularies.map(v => v.id)
    },
  });
  if (response.status === 200) {
    return {
      success: true,
    };
  }
  return { success: false };
};

export default updateTerm;
